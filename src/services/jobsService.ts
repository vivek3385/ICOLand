import cron from 'node-cron';
import { RewardService } from './rewardService';
import User from '../models/User';
import Transaction from '../models/Transaction';

interface JobStatus {
  name: string;
  schedule: string;
  lastRun?: Date;
  lastResult?: string;
  running: boolean;
}

const jobs: Map<string, JobStatus> = new Map();

/**
 * Register and log a cron job
 */
function registerJob(
  name: string,
  schedule: string,
  handler: () => Promise<void>
): void {
  jobs.set(name, { name, schedule, running: false });

  cron.schedule(schedule, async () => {
    const job = jobs.get(name)!;
    if (job.running) {
      console.log(`⏭️ Skipping "${name}" — previous run still active`);
      return;
    }

    job.running = true;
    const start = Date.now();
    console.log(`🚀 [CRON] Starting "${name}"...`);

    try {
      await handler();
      const duration = Date.now() - start;
      job.lastRun = new Date();
      job.lastResult = `✅ Completed in ${duration}ms`;
      console.log(`✅ [CRON] "${name}" done in ${duration}ms`);
    } catch (error: any) {
      job.lastResult = `❌ Failed: ${error.message}`;
      console.error(`❌ [CRON] "${name}" failed:`, error.message);
    } finally {
      job.running = false;
    }
  });

  console.log(`📅 Registered cron: "${name}" → ${schedule}`);
}

/**
 * Initialize all background cron jobs
 */
export function initJobs(): void {
  console.log('\n🔧 Initializing background jobs...');

  // Every day at midnight UTC — calculate staking rewards
  registerJob('daily-staking-rewards', '0 0 * * *', async () => {
    const result = await RewardService.calculateStakingRewards();
    console.log(`  → Calculated: ${result.distributed} rewards, ${result.totalTokens.toFixed(4)} tokens`);
  });

  // Every day at 1:00 AM UTC — distribute all pending rewards
  registerJob('distribute-pending-rewards', '0 1 * * *', async () => {
    const result = await RewardService.distributePendingRewards();
    console.log(`  → Distributed: ${result.distributed} rewards`);
  });

  // Every hour — cleanup expired/failed pending transactions older than 24h
  registerJob('cleanup-stale-transactions', '0 * * * *', async () => {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await Transaction.updateMany(
      { status: 'pending', createdAt: { $lt: cutoff } },
      { status: 'cancelled', errorMessage: 'Automatically cancelled after 24h' }
    );
    if (result.modifiedCount > 0) {
      console.log(`  → Cancelled ${result.modifiedCount} stale transactions`);
    }
  });

  // Every 6 hours — log platform analytics snapshot
  registerJob('analytics-snapshot', '0 */6 * * *', async () => {
    const [userCount, txCount, pendingRewards] = await Promise.all([
      User.countDocuments(),
      Transaction.countDocuments({ status: 'completed' }),
      Transaction.countDocuments({ status: 'pending' }),
    ]);
    console.log(`  📊 Snapshot → Users: ${userCount} | Completed TXs: ${txCount} | Pending TXs: ${pendingRewards}`);
  });

  console.log(`✅ ${jobs.size} background jobs initialized\n`);
}

/**
 * Get status of all registered jobs
 */
export function getJobStatus(): JobStatus[] {
  return Array.from(jobs.values());
}
