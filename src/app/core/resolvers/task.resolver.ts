import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { Task } from '../../shared/models/task.model';
import { TaskService } from '../services/task.service';

export const taskResolver: ResolveFn<Task> = (route) => {
  const taskService = inject(TaskService);
  const router = inject(Router);
  const id = Number(route.paramMap.get('id'));

  return taskService.getById(id).pipe(
    catchError(() => {
      router.navigate(['/not-found']);
      return EMPTY;
    })
  );
};
