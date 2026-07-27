import mongoose, { Schema, Document } from 'mongoose'

export type LeadStatus =
  | 'new'
  | 'contacted' | 'interested' | 'follow_up' | 'negotiating' | 'converted' | 'lost'
  | 'replied' | 'resolved'
  | 'shortlisted' | 'interviewed' | 'hired' | 'rejected'

export type BusinessType = 'dealer' | 'retailer' | 'distributor' | 'wholesaler' | 'caterer' | 'temple' | 'corporate' | 'other'

export type LeadSource = 'dealer-form' | 'contact-form' | 'career-form'

export interface INote {
  text: string
  addedBy: mongoose.Types.ObjectId
  addedAt: Date
}

export interface ILead extends Document {
  name: string
  phone: string
  email?: string
  city?: string
  businessName?: string
  businessType?: BusinessType
  products?: string
  role?: string
  source?: LeadSource
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
  city: { type: String },
  businessName: { type: String },
  businessType: { type: String, enum: ['dealer', 'retailer', 'distributor', 'wholesaler', 'caterer', 'temple', 'corporate', 'other'] },
  products: { type: String },
  role: { type: String },
  source: { type: String, enum: ['dealer-form', 'contact-form', 'career-form'] },
  message: { type: String },
  status: {
    type: String,
    enum: ['new', 'contacted', 'interested', 'follow_up', 'negotiating', 'converted', 'lost', 'replied', 'resolved', 'shortlisted', 'interviewed', 'hired', 'rejected'],
    default: 'new',
  },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  notes: [NoteSchema],
}, { timestamps: true })

export const Lead = mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema)
