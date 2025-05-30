import mongoose from 'mongoose';

// Define the schema for workouts
const workoutSchema = new mongoose.Schema({
  title: String,
  date: String,
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      weight: Number,
      restTime: Number
    }
  ]
});

const Workout = mongoose.model('workouts', workoutSchema);
export default Workout;
