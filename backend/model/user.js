import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'manager', 'support'], default: 'support' },
  assignedOrgs: [{ type: Schema.Types.ObjectId, ref: 'Organization' }],
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  lastLoginAt: { type: Date },
  otp: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true });

const User = model('User', UserSchema);
export default User;
