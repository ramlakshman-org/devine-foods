import mongoose, { Schema, Document } from 'mongoose'

export type LeadStatus = 'new' | 'contacted' | 'interested' | 'follow_up' | 'negotiating' | 'converted' | 'lost'
export type BusinessType = 'retailer' | 'distributor' | 'wholesaler' | 'other'

export interface INote {
  text: string
  addedBy: mongoose.Types.ObjectId
  addedAt: Date
}

export interface ILead extends Document {
  name: string
  phone: string
  email?: string
  city: string
  businessType: BusinessType
  message?: string
  status: LeadStatus
  assignedTo?: mongoose.Types.ObjectId
  notes: INote[]
  createdAt: Date
  updatedAt: Date
}

const NoteSchema = new Schema<INote>({
  text: { type: String, required: true },
  addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now },
})

const LeadSchema = new Schema<ILead>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  city: { type: String, required: true },
  businessType: { type: String, enum: ['retailer', 'distributor', 'wholesaler', 'other'], required: true },
  message: { type: String },
  status: { type: String, enum: ['new', 'contacted', 'interested', 'follow_up', 'negotiating', 'converted', 'lost'], default: 'new' },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  notes: [NoteSchema],
}, { timestamps: true })

export const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema)
