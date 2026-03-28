import express from 'express';
import FleetStats from '../models/FleetStats.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let stats = await FleetStats.findOne();
    if (!stats) {
      stats = await FleetStats.create({});
    }
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
