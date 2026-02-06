import { Routes } from '@angular/router';
import { taskResolver } from './core/resolvers/task.resolver';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadComponent: () => import('./features/tasks/task-list/task-list').then(m => m.TaskList)
  },
  {
    path: 'tasks/new',
    loadComponent: () => import('./features/tasks/task-form/task-form').then(m => m.TaskForm),
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'tasks/:id/edit',
    loadComponent: () => import('./features/tasks/task-form/task-form').then(m => m.TaskForm),
    resolve: { task: taskResolver },
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'not-found',
    loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound)
  },
  { path: '**', redirectTo: 'not-found' }
];
