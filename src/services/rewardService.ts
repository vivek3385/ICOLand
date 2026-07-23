import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import Reward from '../models/Reward';
import Transaction from '../models/Transaction';
import { env } from '../config/env';

export class RewardService {
  /**
   * Calculate and create staking rewards for all staking users
   * Typically called by a daily cron job
   */
  static async calculateStakingRewards(): Promise<{ distributed: number; totalTokens: number }> {
    const stakingUsers = await User.find({ stakedBalance: { $gt: 0 } });

    if (stakingUsers.length === 0) {
      console.log('📊 No staking users found');
      return { distributed: 0, totalTokens: 0 };
    }

    const batchId = uuidv4();
    const dailyRate = env.STAKING_REWARD_RATE / 365;
    let totalDistributed = 0;

    const rewardDocs = stakingUsers.map((user) => {
      const reward = user.stakedBalance * dailyRate;
      totalDistributed += reward;
      return {
        userId: user._id,
        type: 'staking' as const,
        amount: parseFloat(reward.toFixed(6)),
        tokenSymbol: env.TOKEN_SYMBOL,
        reason: `Daily staking reward — ${env.STAKING_REWARD_RATE * 100}% APY`,
        status: 'pending' as const,
        metadata: {
          stakingPeriodDays: 1,
          batchId,
        },
      };
    });

    await Reward.insertMany(rewardDocs);
    console.log(
      `📈 Staking rewards created: ${rewardDocs.length} users, total: ${totalDistributed.toFixed(4)} ${env.TOKEN_SYMBOL} | batch: ${batchId}`
    );

    return { distributed: rewardDocs.length, totalTokens: totalDistributed };
  }

  /**
   * Distribute all pending rewards — credit user balances
   */
  static async distributePendingRewards(): Promise<{ distributed: number }> {
    const pendingRewards = await Reward.find({ status: 'pending' });

    if (pendingRewards.length === 0) {
      console.log('✅ No pending rewards to distribute');
      return { distributed: 0 };
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      for (const reward of pendingRewards) {
        // Credit user balance
        await User.findByIdAndUpdate(
          reward.userId,
          {
            $inc: { tokenBalance: reward.amount, totalRewardsEarned: reward.amount },
          },
          { session }
        );

        // Create transaction record
        await Transaction.create(
          [
            {
              userId: reward.userId,
              type: 'reward',
              amount: reward.amount,
              tokenSymbol: reward.tokenSymbol,
              status: 'completed',
              processedAt: new Date(),
              metadata: { rewardId: reward._id, rewardType: reward.type, reason: reward.reason },
            },
          ],
          { session }
        );

        // Mark reward as distributed
        reward.status = 'distributed';
        reward.distributedAt = new Date();
        await reward.save({ session });
      }

      await session.commitTransaction();
      console.log(`💰 Distributed ${pendingRewards.length} rewards`);
      return { distributed: pendingRewards.length };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Grant referral reward when a new user signs up with a referral code
   */
  static async grantReferralReward(referredByCode: string, newUserId: string): Promise<void> {
    const referrer = await User.findOne({ referralCode: referredByCode });
    if (!referrer) return;

    await Reward.create({
      userId: referrer._id,
      type: 'referral',
      amount: env.REFERRAL_REWARD_AMOUNT,
      tokenSymbol: env.TOKEN_SYMBOL,
      reason: `Referral bonus — new user joined with your code`,
      status: 'pending',
      metadata: { sourceUserId: newUserId },
    });

    console.log(`🎁 Referral reward created for ${referrer.email}: ${env.REFERRAL_REWARD_AMOUNT} ${env.TOKEN_SYMBOL}`);
  }

  /**
   * Manually issue an airdrop reward to a specific user
   */
  static async issueAirdrop(
    userId: string,
    amount: number,
    reason: string
  ): Promise<void> {
    await Reward.create({
      userId,
      type: 'airdrop',
      amount,
      tokenSymbol: env.TOKEN_SYMBOL,
      reason,
      status: 'pending',
    });
    console.log(`🪂 Airdrop queued: ${amount} ${env.TOKEN_SYMBOL} for user ${userId}`);
  }

  /**
   * Issue an LLM-decided reward
   */
  static async issueLlmReward(
    userId: string,
    amount: number,
    reason: string,
    llmAnalysis: string
  ): Promise<void> {
    await Reward.create({
      userId,
      type: 'llm_decision',
      amount,
      tokenSymbol: env.TOKEN_SYMBOL,
      reason,
      status: 'pending',
      metadata: { llmAnalysis },
    });
    console.log(`🤖 LLM reward queued: ${amount} ${env.TOKEN_SYMBOL} for user ${userId} — ${reason}`);
  }

  /**
   * Get user reward history
   */
  static async getUserRewards(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [rewards, total] = await Promise.all([
      Reward.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Reward.countDocuments({ userId }),
    ]);
    return {
      rewards,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get user pending rewards total
   */
  static async getUserPendingTotal(userId: string): Promise<number> {
    const result = await Reward.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return result[0]?.total || 0;
  }
}
