import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { TransactionService } from '../services/transactionService';
import { env } from '../config/env';

const router = Router();

// All routes require authentication
router.use(authenticate);

// POST /api/transactions/buy
router.post('/buy', async (req: AuthRequest, res: Response) => {
  try {
    const { usdAmount } = req.body;

    if (!usdAmount || isNaN(usdAmount) || usdAmount <= 0) {
      return res.status(400).json({ error: 'Invalid USD amount' });
    }

    if (usdAmount < 10) {
      return res.status(400).json({ error: 'Minimum purchase is $10' });
    }

    const result = await TransactionService.buyTokens(req.userId!, parseFloat(usdAmount));

    return res.status(201).json({
      message: `Successfully purchased tokens`,
      tokenAmount: result.transaction.amount,
      tokenSymbol: env.TOKEN_SYMBOL,
      priceUSD: env.TOKEN_PRICE_USD,
      totalPaidUSD: usdAmount,
      newBalance: result.newBalance,
      transaction: result.transaction,
    });
  } catch (error: any) {
    console.error('Buy tokens error:', error);
    return res.status(400).json({ error: error.message });
  }
});

// POST /api/transactions/transfer
router.post('/transfer', async (req: AuthRequest, res: Response) => {
  try {
    const { recipientEmail, amount } = req.body;

    if (!recipientEmail || !amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Recipient email and valid amount are required' });
    }

    if (amount < 1) {
      return res.status(400).json({ error: 'Minimum transfer is 1 token' });
    }

    const result = await TransactionService.transferTokens(
      req.userId!,
      recipientEmail,
      parseFloat(amount)
    );

    return res.status(200).json({
      message: `Successfully transferred ${amount} ${env.TOKEN_SYMBOL}`,
      transaction: result.transaction,
    });
  } catch (error: any) {
    console.error('Transfer error:', error);
    return res.status(400).json({ error: error.message });
  }
});

// POST /api/transactions/stake
router.post('/stake', async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const result = await TransactionService.stakeTokens(req.userId!, parseFloat(amount));

    return res.status(200).json({
      message: `Successfully staked ${amount} ${env.TOKEN_SYMBOL}`,
      newStakedBalance: result.newStakedBalance,
      stakingAPY: `${(env.STAKING_REWARD_RATE * 100).toFixed(1)}%`,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// POST /api/transactions/unstake
router.post('/unstake', async (req: AuthRequest, res: Response) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const result = await TransactionService.unstakeTokens(req.userId!, parseFloat(amount));

    return res.status(200).json({
      message: `Successfully unstaked ${amount} ${env.TOKEN_SYMBOL}`,
      newBalance: result.newBalance,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

// GET /api/transactions — User transaction history
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const result = await TransactionService.getUserTransactions(req.userId!, page, limit);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
