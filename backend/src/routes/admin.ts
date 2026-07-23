import { Router, Request, Response } from 'express';
import { authenticate, requireAdmin, requireAdminKey } from '../middleware/auth';
import { RewardService } from '../services/rewardService';
import { getJobStatus } from '../services/jobsService';
import User from '../models/User';
import Transaction from '../models/Transaction';
import Reward from '../models/Reward';
import { env } from '../config/env';

const router = Router();

// Require both admin key (header) and JWT admin user
router.use(requireAdminKey);
router.use(authenticate);
router.use(requireAdmin);

// POST /api/admin/distribute-rewards — Manually trigger reward distribution
router.post('/distribute-rewards', async (req: Request, res: Response) => {
  try {
    const result = await RewardService.distributePendingRewards();
    return res.json({
      message: 'Reward distribution completed',
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/calculate-staking — Manually trigger staking reward calculation
router.post('/calculate-staking', async (req: Request, res: Response) => {
  try {
    const result = await RewardService.calculateStakingRewards();
    return res.json({
      message: 'Staking rewards calculated',
      ...result,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/airdrop — Issue airdrop to a user
router.post('/airdrop', async (req: Request, res: Response) => {
  try {
    const { userId, amount, reason } = req.body;
    if (!userId || !amount || !reason) {
      return res.status(400).json({ error: 'userId, amount, and reason are required' });
    }

    await RewardService.issueAirdrop(userId, parseFloat(amount), reason);
    return res.json({ message: `Airdrop queued: ${amount} ${env.TOKEN_SYMBOL} for user ${userId}` });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/admin/analytics — Full platform analytics
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalTransactions,
      completedTx,
      pendingTx,
      pendingRewards,
      distributedRewards,
      totalTokensStaked,
    ] = await Promise.all([
      User.countDocuments(),
      Transaction.countDocuments(),
      Transaction.countDocuments({ status: 'completed' }),
      Transaction.countDocuments({ status: 'pending' }),
      Reward.countDocuments({ status: 'pending' }),
      Reward.countDocuments({ status: 'distributed' }),
      User.aggregate([{ $group: { _id: null, total: { $sum: '$stakedBalance' } } }]),
    ]);

    const tokenVolume = await Transaction.aggregate([
      { $match: { type: 'buy', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const rewardVolume = await Reward.aggregate([
      { $match: { status: 'distributed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return res.json({
      users: { total: totalUsers },
      transactions: {
        total: totalTransactions,
        completed: completedTx,
        pending: pendingTx,
        volumeTokens: tokenVolume[0]?.total || 0,
      },
      rewards: {
        pending: pendingRewards,
        distributed: distributedRewards,
        volumeDistributed: rewardVolume[0]?.total || 0,
      },
      staking: {
        totalStaked: totalTokensStaked[0]?.total || 0,
        tokenSymbol: env.TOKEN_SYMBOL,
        apy: `${(env.STAKING_REWARD_RATE * 100).toFixed(1)}%`,
      },
      token: {
        symbol: env.TOKEN_SYMBOL,
        priceUSD: env.TOKEN_PRICE_USD,
        totalSupply: env.TOKEN_TOTAL_SUPPLY,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/jobs — Get background job status
router.get('/jobs', (req: Request, res: Response) => {
  const status = getJobStatus();
  return res.json({ jobs: status });
});

// GET /api/admin/users — List all users
router.get('/users', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      User.countDocuments(),
    ]);

    return res.json({ users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
