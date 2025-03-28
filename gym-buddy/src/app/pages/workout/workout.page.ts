import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  restTime: number;
}


@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  standalone: false
})
export class WorkoutPage implements OnInit {
  workout: {
    title: string;
    date: string;
    exercises: Exercise[];
  } = {
    title: '',
    date: '',
    exercises: [],
  };

  workouts: any[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadWorkouts();
  }

  addExercise() {
    this.workout.exercises.push({
      name: '',
      sets: 0,
      reps: 0,
      weight: 0,
      restTime: 0,
    });
  }

  removeExercise(index: number) {
    this.workout.exercises.splice(index, 1);
  }

  submitWorkout() {
    if (!this.workout.title || !this.workout.date || this.workout.exercises.length === 0) {
      alert('Please fill all fields');
      return;
    }

    this.api.addWorkout(this.workout).subscribe({
      next: () => {
        alert('Workout logged!');
        this.workout = { title: '', date: '', exercises: [] };
        this.loadWorkouts();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add workout');
      },
    });
  }

  loadWorkouts() {
    this.api.getWorkouts().subscribe({
      next: (res) => (this.workouts = res.message),
      error: (err) => console.error(err),
    });
  }

  deleteWorkout(id: string) {
    this.api.deleteWorkout(id).subscribe({
      next: () => this.loadWorkouts(),
      error: (err) => console.error(err),
    });
  }
}
