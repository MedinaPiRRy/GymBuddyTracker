import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage {
  latestWorkout: any = null;
  latestMetric: any = null;
  activeGoals: any[] = [];

  constructor(private api: ApiService) { }

  // Lifecycle hook that is called when the component is about to be displayed
  // This is where we can load data that needs to be displayed in the view
  // This is better thatn ngOnInit() because it is called every time the view is about to be displayed, so all data is always up to date
  ionViewWillEnter() {
    this.loadLatestWorkout();
    this.loadLatestMetric();
    this.loadActiveGoals();
  }

  loadLatestWorkout() {
    this.api.getWorkouts().subscribe({
      next: (res) => {
        const sorted = res.message.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.latestWorkout = sorted[0];
      },
      error: (err) => console.error(err),
    });
  }

  loadLatestMetric() {
    this.api.getMetrics().subscribe({
      next: (res) => {
        const sorted = res.message.sort(
          (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.latestMetric = sorted[0];
      },
      error: (err) => console.error(err),
    });
  }

  loadActiveGoals() {
    this.api.getGoals().subscribe({
      next: (res) => {
        this.activeGoals = res.message.filter((g: any) => !g.isCompleted);
      },
      error: (err) => console.error(err),
    });
  }

}
