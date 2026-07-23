import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`❌ Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '5001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI!,
  MONGODB_NAME: process.env.MONGODB_NAME || 'icoland',
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  LLM_PROVIDER: (process.env.LLM_PROVIDER as 'openai' | 'gemini') || 'openai',
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY || 'dev-admin-secret',
  TOKEN_SYMBOL: process.env.TOKEN_SYMBOL || 'HVR',
  TOKEN_TOTAL_SUPPLY: parseInt(process.env.TOKEN_TOTAL_SUPPLY || '50000000', 10),
  TOKEN_PRICE_USD: parseFloat(process.env.TOKEN_PRICE_USD || '0.05'),
  STAKING_REWARD_RATE: parseFloat(process.env.STAKING_REWARD_RATE || '0.05'),
  REFERRAL_REWARD_AMOUNT: parseFloat(process.env.REFERRAL_REWARD_AMOUNT || '100'),
};
