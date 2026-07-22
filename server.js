import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const dbName = process.env.MONGODB_NAME || 'icoland';
const rawURI = process.env.MONGODB_URI;

if (!rawURI) {
  console.error('❌ MONGODB_URI is not defined in .env');
  process.exit(1);
}

// Inject database name only if not already present in the URI.
// Handles both:
//   mongodb+srv://user:pass@cluster.net/?appName=...  → insert before "?"
//   mongodb://user:pass@host1,host2/icoland?ssl=...  → already has dbName, skip
let MONGODB_URI = rawURI;
const uriWithoutCreds = rawURI.replace(/:([^@]*)@/, '@'); // remove password for analysis
const hasDbName = /\.net(:\d+)?(,[\w.:]+)*\/[a-zA-Z0-9_-]+(\?|$)/.test(uriWithoutCreds);

if (!hasDbName) {
  if (rawURI.includes('/?')) {
    MONGODB_URI = rawURI.replace('/?', `/${dbName}?`);
  } else if (rawURI.includes('?')) {
    MONGODB_URI = rawURI.replace('?', `/${dbName}?`);
  } else {
    MONGODB_URI = rawURI.endsWith('/') ? `${rawURI}${dbName}` : `${rawURI}/${dbName}`;
  }
}

// Log connection info without leaking credentials
const safeURI = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
console.log(`🔌 Connecting to MongoDB: ${safeURI}`);

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    const connDb = mongoose.connection.db.databaseName;
    console.log(`✅ Connected to MongoDB Atlas — Database: "${connDb}"`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
// 1. User Signup
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 2. User Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    res.status(200).json({ 
      message: 'Login successful!',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 3. Debug: List all users in the connected DB (dev only)
app.get('/api/debug/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // exclude password
    res.json({ database: mongoose.connection.db.databaseName, count: users.length, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Debug: Delete a user by email (dev only — remove in production)
app.delete('/api/debug/user/:email', async (req, res) => {
  try {
    const result = await User.deleteOne({ email: req.params.email });
    res.json({ deleted: result.deletedCount, email: req.params.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
