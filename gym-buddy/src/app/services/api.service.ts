import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Workout APIs
  getWorkouts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/workouts/retrieve`);
  }

  addWorkout(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/workouts/insert`, data);
  }

  updateWorkout(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/workouts/update`, data);
  }

  deleteWorkout(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/workouts/delete?_id=${id}`);
  }

  // Goals APIs
  getGoals(): Observable<any> {
    return this.http.get(`${this.baseUrl}/goals/retrieve`);
  }

  addGoal(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/goals/insert`, data);
  }

  updateGoal(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/goals/update`, data);
  }

  deleteGoal(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/goals/delete?_id=${id}`);
  }

  // Metrics APIs
  getMetrics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/metrics/retrieve`);
  }

  addMetric(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/metrics/insert`, data);
  }

  updateMetric(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/metrics/update`, data);
  }

  deleteMetric(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/metrics/delete?_id=${id}`);
  }
}
