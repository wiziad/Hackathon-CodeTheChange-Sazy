import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: 'event' | 'message' | 'system';
  title: string;
  message: string;
  read: boolean;
  relatedId?: mongoose.Types.ObjectId;
}

const notificationSchema = new Schema<INotification>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['event', 'message', 'system'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  relatedId: {
    type: Schema.Types.ObjectId,
    refPath: 'type',
  },
}, {
  timestamps: true,
});

notificationSchema.index({ recipient: 1, read: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);