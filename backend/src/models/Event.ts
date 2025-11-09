import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  organizer: mongoose.Types.ObjectId;
  location: {
    type: string;
    coordinates: number[];
    address: string;
  };
  date: Date;
  startTime: string;
  endTime: string;
  type: 'food' | 'clothing' | 'other';
  capacity: number;
  attendees: mongoose.Types.ObjectId[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  images?: string[];
}

const eventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['food', 'clothing', 'other'],
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  images: [{
    type: String,
  }],
}, {
  timestamps: true,
});

eventSchema.index({ location: '2dsphere' });

export default mongoose.model<IEvent>('Event', eventSchema);