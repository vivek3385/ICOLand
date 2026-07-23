import mongoose, { Schema, Document, Model } from 'mongoose';

export type RewardType = 'staking' | 'referral' | 'airdrop' | 'bonus' | 'trading' | 'llm_decision';
export type RewardStatus = 'pending' | 'distributed' | 'cancelled';

export interface IReward extends Document {
  userId: mongoose.Types.ObjectId;
  type: RewardType;
  amount: number;
  tokenSymbol: string;
  reason: string;
  status: RewardStatus;
  distributedAt?: Date;
  expiresAt?: Date;
  metadata?: {
    stakingPeriodDays?: number;
    sourceUserId?: string;    // For referral rewards
    llmAnalysis?: string;     // For LLM-triggered rewards
    batchId?: string;         // For batch reward distributions
  };
  createdAt: Date;
  updatedAt: Date;
}

const rewardSchema = new Schema<IReward>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['staking', 'referral', 'airdrop', 'bonus', 'trading', 'llm_decision'],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    tokenSymbol: { type: String, required: true, default: 'HVR' },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'distributed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    distributedAt: { type: Date },
    expiresAt: { type: Date },
    metadata: {
      stakingPeriodDays: Number,
      sourceUserId: String,
      llmAnalysis: String,
      batchId: String,
    },
  },
  { timestamps: true }
);

// Compound index for user reward history
rewardSchema.index({ userId: 1, status: 1 });
rewardSchema.index({ status: 1, createdAt: -1 });

const Reward: Model<IReward> =
  mongoose.models.Reward || mongoose.model<IReward>('Reward', rewardSchema);

export default Reward;
