import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';

interface Goal {
  _id?: string;
  title: string;
  targetValue: number;
  currentValue?: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
  standalone: false,
})
export class GoalsPage implements OnInit {
  goal: Partial<Goal> = {
    title: '',
    targetValue: 0,
    currentValue: 0,
    unit: '',
    deadline: '',
    isCompleted: false,
  };

  goals: Goal[] = [];

  constructor(private api: ApiService, private toastController: ToastController) {}

  ngOnInit() {
    this.loadGoals();
  }

  // Method to handle the form submission
  submitGoal() {
    if (!this.goal.title || !this.goal.targetValue || !this.goal.deadline) {
      this.presentToast('!!!Please Fill Out All Necessary Fields!!!', 'danger');;
      return;
    }

    const data: Goal = {
      title: this.goal.title!,
      targetValue: this.goal.targetValue!,
      unit: this.goal.unit || '',
      currentValue: this.goal.currentValue || 0,
      deadline: this.goal.deadline!,
      isCompleted: false,
    };

    this.api.addGoal(data).subscribe({
      next: () => {
        this.goal = {
          title: '',
          targetValue: 0,
          currentValue: 0,
          unit: '',
          deadline: '',
          isCompleted: false,
        };
        this.presentToast('Goal Added Successfully!');
        this.loadGoals();
      },
      error: (err) => console.error(err),
    });
  }

  // Method to handle the form reset
  loadGoals() {
    this.api.getGoals().subscribe({
      next: (res) => (this.goals = res.message),
      error: (err) => console.error(err),
    });
  }

  // Method to handle the deletion of a goal
  deleteGoal(id: string) {
    this.api.deleteGoal(id).subscribe({
      next: () => {this.loadGoals(); this.presentToast('Goal Deleted Successfully!');},
      error: (err) => {console.error(err); this.presentToast('Failed to delete goal', 'danger');},
    });
  }

  // Method to handle the update of a goal's completion status and progress
  updateGoal(goal: Goal) {
    this.api
      .updateGoal({
        _id: goal._id,
        fields: { isCompleted: goal.isCompleted },
      })
      .subscribe({
        next: () => {this.loadGoals(); this.presentToast('Goal Updated Successfully!');},
        error: (err) => {console.error(err); this.presentToast('Failed to update goal', 'danger');},
      });
  }

  // Method to handle the update of a goal's progress
  updateGoalProgress(goal: Goal) {
    this.api
      .updateGoal({
        _id: goal._id,
        fields: { currentValue: goal.currentValue },
      })
      .subscribe({
        next: () => this.loadGoals(),
        error: (err) => console.error(err),
      });
  }

  // Method to calculate the progress of a goal
  getGoalProgress(goal: Goal): number {
    return goal.currentValue && goal.targetValue
      ? Math.min(goal.currentValue / goal.targetValue, 1)
      : 0;
  }

  // Method to handle the display of a toast message
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
