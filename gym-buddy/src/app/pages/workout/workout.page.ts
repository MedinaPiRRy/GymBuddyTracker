import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';

interface Exercise {
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  restTime?: number;
}

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  standalone: false,
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

  constructor(private api: ApiService, private toastController: ToastController) {}

  ngOnInit() {
    this.loadWorkouts(); // Load workouts on initialization
  }

  // Method to handle the form submission
  addExercise() {
    this.workout.exercises.push({
      name: '',
      sets: undefined,
      reps: undefined,
      weight: undefined,
      restTime: undefined,
    });
  }

  // Method to handle the removal of an exercise
  removeExercise(index: number) {
    this.workout.exercises.splice(index, 1);
  }

  // Method to handle the form submission
  submitWorkout() {
    if (
      !this.workout.title ||
      !this.workout.date ||
      this.workout.exercises.length === 0
    ) {
      this.presentToast('!!!Please Fill Out All Necessary Fields!!!', 'danger');
      return;
    }

    this.api.addWorkout(this.workout).subscribe({
      next: () => {
        this.presentToast('Workout Added Successfully!');
        this.workout = { title: '', date: '', exercises: [] };
        this.loadWorkouts();
      },
      error: (err) => {
        console.error(err);
        this.presentToast('Error Adding Workout', 'danger');
      },
    });
  }

  // Method to load workouts
  loadWorkouts() {
    this.api.getWorkouts().subscribe({
      next: (res) => (this.workouts = res.message),
      error: (err) => console.error(err),
    });
  }

  // Method to handle the deletion of a workout
  deleteWorkout(id: string) {
    this.api.deleteWorkout(id).subscribe({
      next: () => {this.loadWorkouts(); this.presentToast('Workout Deleted Successfully!');},
      error: (err) => {console.error(err); this.presentToast('Failed to delete workout', 'danger');},
    });
  }

  // Method to present a toast message
  async presentToast(message: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
    });
    await toast.present();
  }  
}
