import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Inquiry', inquirySchema);
