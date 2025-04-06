import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// Created routes for all pages in the app
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'workout',
    loadChildren: () => import('./pages/workout/workout.module').then( m => m.WorkoutPageModule)
  },
  {
    path: 'progress',
    loadChildren: () => import('./pages/progress/progress.module').then( m => m.ProgressPageModule)
  },
  {
    path: 'goals',
    loadChildren: () => import('./pages/goals/goals.module').then( m => m.GoalsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
