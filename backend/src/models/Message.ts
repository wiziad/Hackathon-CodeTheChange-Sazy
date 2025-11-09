import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  content: string;
  threadId: string;
  read: boolean;
  attachments?: string[];
}

const messageSchema = new Schema<IMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  threadId: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  attachments: [{
    type: String,
  }],
}, {
  timestamps: true,
});

messageSchema.index({ threadId: 1 });
messageSchema.index({ sender: 1, receiver: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);