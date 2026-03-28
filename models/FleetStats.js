import mongoose from 'mongoose';

const fleetStatsSchema = new mongoose.Schema({
  totalVehicles: { type: Number, default: 100 },
  yearsExperience: { type: Number, default: 12 },
  currentTurnover: { type: String, default: '33.75 Cr+' },
  citiesCovered: { type: Number, default: 28 },
  happyClients: { type: Number, default: 500 },
}, { timestamps: true });

export default mongoose.model('FleetStats', fleetStatsSchema);
