import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IActivity extends Document {
  task: Types.ObjectId;
  user: Types.ObjectId;
  action: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IActivity>('Activity', ActivitySchema);
