import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskStore, TaskFilters } from '../../../core/store/task.store';
import { Task } from '../../../shared/models/task.model';
import { TaskCard } from '../../../shared/components/task-card/task-card';
import { TaskFilter } from '../../../shared/components/task-filter/task-filter';

@Component({
  selector: 'app-task-list',
  imports: [TaskCard, TaskFilter],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList implements OnInit {
  readonly store = inject(TaskStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.store.loadTasks();
  }

  onFiltersChange(filters: TaskFilters): void {
    this.store.setFilters(filters);
  }

  onEditTask(task: Task): void {
    this.router.navigate(['/tasks', task.id, 'edit']);
  }

  onDeleteTask(id: number): void {
    this.store.deleteTask(id);
  }

  onStatusChange(event: { id: number; status: Task['status'] }): void {
    this.store.updateStatus(event.id, event.status);
  }
}
