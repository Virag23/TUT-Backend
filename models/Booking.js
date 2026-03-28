import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  materialType: { type: String, required: true, enum: ['Coal', 'Mineral', 'Iron Ore', 'Machinery', 'Others'] },
  weight: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Confirmed', 'In Transit', 'Delivered'] },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
