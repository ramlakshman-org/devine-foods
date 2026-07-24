import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  username: string
  passwordHash: string
  role: 'admin' | 'telecaller'
  isActive: boolean
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'telecaller'], default: 'telecaller' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
