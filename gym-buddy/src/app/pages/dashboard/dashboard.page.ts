import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ModalController } from '@ionic/angular';
import {
  Chart as ChartJS,
  ChartDataset,
  CategoryScale,
  LinearScale,
  LineController,
  BarController,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false,
})
export class DashboardPage {
  workouts: any[] = [];
  latestWorkout: any = null;
  bodyMetrics: any[] = [];
  latestMetric: any = null;
  activeGoals: any[] = [];
  goals: any[] = [];

  // Data needed to display charts
  weightChartLabels: string[] = [];
  weightChartData: { labels: string[]; datasets: ChartDataset<'line'>[] } = {
    labels: [],
    datasets: [
      {
        label: 'Total Weight (lbs)',
        data: [],
        borderColor: '#ff9900',
        backgroundColor: 'rgba(255, 153, 0, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  consistencyChartLabels: string[] = [];
  consistencyChartData: { labels: string[]; datasets: ChartDataset<'bar'>[] } =
    {
      labels: [],
      datasets: [
        {
          label: 'Workouts per Week',
          data: [],
          backgroundColor: '#32db64',
        },
      ],
    };

  bodyChartLabels: string[] = [];
  bodyChartData: { labels: string[]; datasets: ChartDataset<'line'>[] } = {
    labels: [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [],
        borderColor: '#ff3c00',
        backgroundColor: 'rgba(255, 60, 0, 0.2)',
        tension: 0.3,
        fill: true,
      },
      {
        label: 'Dots',
        data: [],
        borderColor: '#488aff',
        backgroundColor: 'rgba(72, 138, 255, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true },
    },
  };

  constructor(private api: ApiService, private modalCtrl: ModalController) {
    // Registering Chart.js components to use in the charts
    ChartJS.register(
      CategoryScale,
      LinearScale,
      LineController,
      BarController,
      PointElement,
      LineElement,
      BarElement,
      Title,
      Tooltip,
      Filler,
      Legend
    );
  }

  // Lifecycle hook that is called when the component is about to be displayed
  // This is where we can load data that needs to be displayed in the view
  // This is better thatn ngOnInit() because it is called every time the view is about to be displayed, so all data is always up to date
  ionViewWillEnter() {
    this.loadLatestWorkout();
    this.loadLatestMetric();
    this.loadActiveGoals();
    this.loadAllGoals();
  }

  // Function to calculate the dots based on weight and height
  processWorkoutChart() {
    const labels: string[] = [];
    const data: number[] = [];

    const workoutsSorted = [...this.workouts].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    workoutsSorted.forEach((workout) => {
      console.log('Workout:', workout);
      const total = workout.exercises.reduce(
        (sum: number, ex: any) => sum + ex.reps * ex.sets * ex.weight,
        0
      );
      labels.push(new Date(workout.date).toLocaleDateString());
      data.push(total);
    });

    this.weightChartLabels = labels;
    this.weightChartData = {
      labels,
      datasets: [
        {
          label: 'Total Weight (lbs)',
          data,
          borderColor: '#ff9900',
          backgroundColor: 'rgba(255, 153, 0, 0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    };

    console.log('Chart Labels:', this.weightChartLabels);
    console.log('Chart Data:', this.weightChartData.datasets[0].data);
  }

  // Function to calculate the consistency chart based on workouts per week
  processConsistencyChart() {
    const weekMap = new Map<string, number>();

    this.workouts.forEach((workout) => {
      const date = new Date(workout.date);
      const year = date.getFullYear();
      const week = this.getWeekNumber(date);
      const key = `${year}-W${week}`;
      weekMap.set(key, (weekMap.get(key) || 0) + 1);
    });

    const sortedWeeks = Array.from(weekMap.keys()).sort();
    console.log('Sorted Weeks:', sortedWeeks);
    this.consistencyChartLabels = sortedWeeks;
    this.consistencyChartData = {
      labels: sortedWeeks,
      datasets: [
        {
          label: 'Workouts per Week',
          data: sortedWeeks.map((k) => weekMap.get(k) || 0),
          backgroundColor: '#32db64',
        },
      ],
    };
  }

  // Function to calculate the week number based on the date
  getWeekNumber(date: Date): number {
    const d = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  }

  // Function to process the body chart based on the metrics
  processBodyChart() {
    const sorted = [...this.bodyMetrics].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    this.bodyChartLabels = sorted.map((m) =>
      new Date(m.date).toLocaleDateString()
    );
    this.bodyChartData = {
      labels: sorted.map((m) => new Date(m.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Weight (kg)',
          data: sorted.map((m) => m.weight),
          borderColor: '#ff3c00',
          backgroundColor: 'rgba(255, 60, 0, 0.2)',
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Dots',
          data: sorted.map((m) => m.dots),
          borderColor: '#488aff',
          backgroundColor: 'rgba(72, 138, 255, 0.2)',
          tension: 0.3,
          fill: true,
        },
      ],
    };

    console.log('Body Chart Labels:', this.bodyChartLabels);
    console.log('Body Chart Data:', this.bodyChartData.datasets[0].data);
    console.log('Body Chart Dots Data:', this.bodyChartData.datasets[1].data);
  }

  // Function to load the latest workout from the API
  loadLatestWorkout() {
    this.api.getWorkouts().subscribe({
      next: (res) => {
        const sorted = res.message.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        this.workouts = sorted;
        this.latestWorkout = sorted[0];
        this.processWorkoutChart();
      },
      error: (err) => console.error(err),
    });
  }

  // Function to load the latest metric from the API
  loadLatestMetric() {
    this.api.getMetrics().subscribe({
      next: (res) => {
        const sorted = res.message.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        this.bodyMetrics = sorted;
        this.latestMetric = sorted[0];
        this.processBodyChart();
        this.processConsistencyChart();
      },
      error: (err) => console.error(err),
    });
  }

  // Function to load active goals from the API
  loadActiveGoals() {
    this.api.getGoals().subscribe({
      next: (res) => {
        this.activeGoals = res.message.filter((g: any) => !g.isCompleted);
      },
      error: (err) => console.error(err),
    });
  }

  // Function to load all goals from the API
  loadAllGoals() {
    this.api.getGoals().subscribe({
      next: (res) => {
        this.goals = res.message;
      },
      error: (err) => console.error(err),
    });
  }
  
  // Function to delete a goal based on its ID
  getGoalProgress(goal: any): number {
    return goal.currentValue && goal.targetValue
      ? Math.min(goal.currentValue / goal.targetValue, 1)
      : 0;
  }

  // Function to open workout details
  openWorkoutDetails(workout: any) {
    console.log('Workout Details:', workout);
  }

  // Function to open goal details
  openBodyMetricDetails(metric: any) {
    console.log('Body Metric Details:', metric);
  }

  // Function to open goal details
  openGoalDetails(goal: any) {
    console.log('Goal Details:', goal);
  }

  // Function to open a modal for adding a new goal
  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
