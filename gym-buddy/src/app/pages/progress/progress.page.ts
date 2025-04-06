import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
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
    Filler
  } from 'chart.js';

interface BodyMetric {
  _id?: string; // Optional field
  date: string;
  weight: number;
  height: number;
  dots: number;
}

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  styleUrls: ['./progress.page.scss'],
  standalone: false
})
export class ProgressPage implements OnInit {
  metric: Partial<BodyMetric> = {
    date: '',
    weight: 0,
    height: 0,
  };

  metrics: BodyMetric[] = [];

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
      }
    ],
  };
  
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    }
  };

  constructor(private api: ApiService) {
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

  ngOnInit() {
    this.loadMetrics();
  }

  calculateDots(weight: number, height: number): number {
    // Placeholder formula: Dots = (weight^2) / height
    return weight && height ? (weight * weight) / height : 0;
  }

  submitMetric() {
    if (!this.metric.date || !this.metric.weight || !this.metric.height) {
      alert('Please fill in all fields');
      return;
    }

    const data: BodyMetric = {
      date: this.metric.date,
      weight: this.metric.weight,
      height: this.metric.height,
      dots: this.calculateDots(this.metric.weight, this.metric.height),
    };

    this.api.addMetric(data).subscribe({
      next: () => {
        alert('Metric added');
        this.metric = { date: '', weight: 0, height: 0 };
        this.loadMetrics();
      },
      error: (err) => {
        console.error(err);
        alert('Failed to add metric');
      },
    });
  }

  loadMetrics() {
    this.api.getMetrics().subscribe({
      next: (res) => {
        this.metrics = res.message;
        this.processBodyChart();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  deleteMetric(id: string) {
    this.api.deleteMetric(id).subscribe({
      next: () => this.loadMetrics(),
      error: (err) => console.error(err),
    });
  }

  processBodyChart() {
    const sorted = [...this.metrics].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  
    this.bodyChartData = {
      labels: sorted.map(m => new Date(m.date).toLocaleDateString()),
      datasets: [
        {
          label: 'Weight (kg)',
          data: sorted.map(m => m.weight),
          borderColor: '#ff3c00',
          backgroundColor: 'rgba(255, 60, 0, 0.2)',
          tension: 0.3,
          fill: true,
        },
        {
          label: 'Dots',
          data: sorted.map(m => m.dots),
          borderColor: '#488aff',
          backgroundColor: 'rgba(72, 138, 255, 0.2)',
          tension: 0.3,
          fill: true,
        }
      ]
    };
  }

}
