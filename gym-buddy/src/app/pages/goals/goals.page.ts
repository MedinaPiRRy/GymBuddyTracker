import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

interface Goal {
  _id?: string;
  title: string;
  targetValue: number;
  unit: string;
  deadline: string;
  isCompleted: boolean;
}

@Component({
  selector: 'app-goals',
  templateUrl: './goals.page.html',
  styleUrls: ['./goals.page.scss'],
  standalone: false
})
export class GoalsPage implements OnInit {
  goal: Partial<Goal> = {
    title: '',
    targetValue: 0,
    unit: '',
    deadline: '',
    isCompleted: false,
  };

  goals: Goal[] = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.loadGoals();
  }

  submitGoal() {
    if (!this.goal.title || !this.goal.targetValue || !this.goal.deadline) {
      alert('Fill in required fields');
      return;
    }

    const data: Goal = {
      title: this.goal.title!,
      targetValue: this.goal.targetValue!,
      unit: this.goal.unit || '',
      deadline: this.goal.deadline!,
      isCompleted: false,
    };

    this.api.addGoal(data).subscribe({
      next: () => {
        this.goal = {
          title: '',
          targetValue: 0,
          unit: '',
          deadline: '',
          isCompleted: false,
        };
        this.loadGoals();
      },
      error: (err) => console.error(err),
    });
  }

  loadGoals() {
    this.api.getGoals().subscribe({
      next: (res) => (this.goals = res.message),
      error: (err) => console.error(err),
    });
  }

  deleteGoal(id: string) {
    this.api.deleteGoal(id).subscribe({
      next: () => this.loadGoals(),
      error: (err) => console.error(err),
    });
  }

  updateGoal(goal: Goal) {
    this.api.updateGoal({
      _id: goal._id,
      fields: { isCompleted: goal.isCompleted },
    }).subscribe({
      next: () => this.loadGoals(),
      error: (err) => console.error(err),
    });
  }
}
