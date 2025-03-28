import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

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

  constructor(private api: ApiService) { }

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

}
