import express from 'express';
import Inquiry from '../models/Inquiry.js';
import { sendInquiryEmails } from '../utils/mailer.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    // Fire emails — don't block response if email fails
    sendInquiryEmails(req.body).catch(err => console.error('Inquiry email error:', err.message));
    res.status(201).json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
