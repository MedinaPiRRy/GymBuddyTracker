import mongoose from 'mongoose';

const bodyMetricSchema = new mongoose.Schema({
  date: String, 
  weight: Number,
  height: Number,
  dots: Number 
});

const BodyMetric = mongoose.model('bodymetrics', bodyMetricSchema);
export default BodyMetric;
