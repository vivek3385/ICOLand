import mongoose, { Schema, Document, Model } from 'mongoose';

export type TransactionType = 'buy' | 'sell' | 'transfer_in' | 'transfer_out' | 'stake' | 'unstake' | 'reward';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  type: TransactionType;
  amount: number;
  tokenSymbol: string;
  priceUSD?: number;
  totalValueUSD?: number;
  recipientId?: mongoose.Types.ObjectId;
  recipientAddress?: string;
  txHash?: string;        // On-chain transaction hash (for future blockchain integration)
  status: TransactionStatus;
  fee?: number;
  metadata?: Record<string, any>;
  errorMessage?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['buy', 'sell', 'transfer_in', 'transfer_out', 'stake', 'unstake', 'reward'],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    tokenSymbol: { type: String, required: true, default: 'HVR' },
    priceUSD: { type: Number },
    totalValueUSD: { type: Number },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User' },
    recipientAddress: { type: String },
    txHash: { type: String, unique: true, sparse: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    fee: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed, default: {} },
    errorMessage: { type: String },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

// Compound index for quick user history lookups
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ status: 1, createdAt: -1 });

const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;
