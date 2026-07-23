import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'icoland_jwt_secret_key_2026_super_secure';

export async function POST(req: Request) {
  try {
    const { name, email, password, referralCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const myReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      referralCode: myReferralCode,
      referredBy: referralCode || null,
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        message: 'Account created successfully',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          tokenBalance: user.tokenBalance || 0,
          stakedBalance: user.stakedBalance || 0,
          referralCode: user.referralCode,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
