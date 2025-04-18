import mongoose from 'mongoose';

// Define the schema for goals
const goalSchema = new mongoose.Schema({
  title: String,
  targetValue: Number,
  currentValue: Number,
  unit: String, // e.g., "lbs", "kg"
  deadline: String, 
  isCompleted: Boolean
});

const Goal = mongoose.model('goals', goalSchema);
export default Goal;
