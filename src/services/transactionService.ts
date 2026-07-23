import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import Transaction from '../models/Transaction';
import { env } from '../config/env';

export class TransactionService {
  /**
   * Buy tokens with USD value
   */
  static async buyTokens(
    userId: string,
    usdAmount: number
  ): Promise<{ transaction: any; newBalance: number }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const tokenAmount = usdAmount / env.TOKEN_PRICE_USD;
      const user = await User.findById(userId).session(session);

      if (!user) throw new Error('User not found');

      // Create transaction record
      const transaction = await Transaction.create(
        [
          {
            userId,
            type: 'buy',
            amount: tokenAmount,
            tokenSymbol: env.TOKEN_SYMBOL,
            priceUSD: env.TOKEN_PRICE_USD,
            totalValueUSD: usdAmount,
            status: 'pending',
            metadata: { usdPaid: usdAmount },
          },
        ],
        { session }
      );

      // Update user balance
      user.tokenBalance += tokenAmount;
      await user.save({ session });

      // Mark transaction as completed
      transaction[0].status = 'completed';
      transaction[0].processedAt = new Date();
      await transaction[0].save({ session });

      await session.commitTransaction();

      console.log(`✅ Buy: User ${userId} bought ${tokenAmount} ${env.TOKEN_SYMBOL}`);
      return { transaction: transaction[0], newBalance: user.tokenBalance };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Transfer tokens between users
   */
  static async transferTokens(
    senderId: string,
    recipientEmail: string,
    amount: number
  ): Promise<{ transaction: any }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const sender = await User.findById(senderId).session(session);
      const recipient = await User.findOne({ email: recipientEmail }).session(session);

      if (!sender) throw new Error('Sender not found');
      if (!recipient) throw new Error('Recipient not found');
      if (sender.id === recipient.id) throw new Error('Cannot transfer to yourself');
      if (sender.tokenBalance < amount)
        throw new Error(`Insufficient balance. You have ${sender.tokenBalance} ${env.TOKEN_SYMBOL}`);

      // Debit sender
      sender.tokenBalance -= amount;
      await sender.save({ session });

      // Credit recipient
      recipient.tokenBalance += amount;
      await recipient.save({ session });

      // Record outgoing transaction
      const [txOut] = await Transaction.create(
        [
          {
            userId: senderId,
            type: 'transfer_out',
            amount,
            tokenSymbol: env.TOKEN_SYMBOL,
            recipientId: recipient._id,
            status: 'completed',
            processedAt: new Date(),
            metadata: { recipientEmail },
          },
        ],
        { session }
      );

      // Record incoming transaction for recipient
      await Transaction.create(
        [
          {
            userId: recipient._id,
            type: 'transfer_in',
            amount,
            tokenSymbol: env.TOKEN_SYMBOL,
            recipientId: sender._id,
            status: 'completed',
            processedAt: new Date(),
            metadata: { senderEmail: sender.email },
          },
        ],
        { session }
      );

      await session.commitTransaction();
      console.log(`🔄 Transfer: ${amount} ${env.TOKEN_SYMBOL} from ${sender.email} → ${recipient.email}`);
      return { transaction: txOut };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Stake tokens (lock for rewards)
   */
  static async stakeTokens(userId: string, amount: number): Promise<{ newStakedBalance: number }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).session(session);
      if (!user) throw new Error('User not found');
      if (user.tokenBalance < amount)
        throw new Error(`Insufficient balance. Available: ${user.tokenBalance} ${env.TOKEN_SYMBOL}`);

      user.tokenBalance -= amount;
      user.stakedBalance += amount;
      await user.save({ session });

      await Transaction.create(
        [
          {
            userId,
            type: 'stake',
            amount,
            tokenSymbol: env.TOKEN_SYMBOL,
            status: 'completed',
            processedAt: new Date(),
            metadata: { stakingRate: env.STAKING_REWARD_RATE },
          },
        ],
        { session }
      );

      await session.commitTransaction();
      console.log(`🔒 Staked: ${amount} ${env.TOKEN_SYMBOL} for user ${userId}`);
      return { newStakedBalance: user.stakedBalance };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Unstake tokens (unlock from staking)
   */
  static async unstakeTokens(userId: string, amount: number): Promise<{ newBalance: number }> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).session(session);
      if (!user) throw new Error('User not found');
      if (user.stakedBalance < amount)
        throw new Error(`Insufficient staked balance. Staked: ${user.stakedBalance} ${env.TOKEN_SYMBOL}`);

      user.stakedBalance -= amount;
      user.tokenBalance += amount;
      await user.save({ session });

      await Transaction.create(
        [
          {
            userId,
            type: 'unstake',
            amount,
            tokenSymbol: env.TOKEN_SYMBOL,
            status: 'completed',
            processedAt: new Date(),
          },
        ],
        { session }
      );

      await session.commitTransaction();
      return { newBalance: user.tokenBalance };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Get user transaction history
   */
  static async getUserTransactions(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments({ userId }),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
