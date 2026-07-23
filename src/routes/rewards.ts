import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { RewardService } from '../services/rewardService';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/rewards — User reward history + pending total
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const [rewardData, pendingTotal] = await Promise.all([
      RewardService.getUserRewards(req.userId!, page, limit),
      RewardService.getUserPendingTotal(req.userId!),
    ]);

    return res.json({
      ...rewardData,
      pendingTotal,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/rewards/claim — Trigger distribution of user's pending rewards
router.post('/claim', async (req: AuthRequest, res: Response) => {
  try {
    const Reward = (await import('../models/Reward')).default;
    const pendingRewards = await Reward.find({ userId: req.userId, status: 'pending' });

    if (pendingRewards.length === 0) {
      return res.status(200).json({ message: 'No pending rewards to claim', distributed: 0 });
    }

    // Process only this user's pending rewards inline
    const User = (await import('../models/User')).default;
    const Transaction = (await import('../models/Transaction')).default;

    let totalClaimed = 0;
    for (const reward of pendingRewards) {
      await User.findByIdAndUpdate(reward.userId, {
        $inc: { tokenBalance: reward.amount, totalRewardsEarned: reward.amount },
      });
      await Transaction.create({
        userId: reward.userId,
        type: 'reward',
        amount: reward.amount,
        tokenSymbol: reward.tokenSymbol,
        status: 'completed',
        processedAt: new Date(),
        metadata: { rewardId: reward._id, rewardType: reward.type },
      });
      reward.status = 'distributed';
      reward.distributedAt = new Date();
      await reward.save();
      totalClaimed += reward.amount;
    }

    return res.json({
      message: `Successfully claimed ${pendingRewards.length} rewards`,
      distributed: pendingRewards.length,
      totalClaimed,
    });
  } catch (error: any) {
    console.error('Claim rewards error:', error);
    return res.status(500).json({ error: error.message });
  }
});

export default router;
