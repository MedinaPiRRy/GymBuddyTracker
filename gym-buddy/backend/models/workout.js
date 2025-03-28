import mongoose from 'mongoose';

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
