import express from 'express';
import Booking from '../models/Booking.js';
import { sendBookingEmails } from '../utils/mailer.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const booking = new Booking({ ...req.body, weight: req.body.weight || 'Not specified' });
    await booking.save();
    // Fire emails — don't block response if email fails
    sendBookingEmails(req.body).catch(err => console.error('Booking email error:', err.message));
    res.status(201).json({ success: true, message: 'Booking submitted successfully!', data: booking });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
