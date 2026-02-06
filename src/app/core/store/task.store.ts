import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Task, TaskStatus, TaskPriority } from '../../shared/models/task.model';
import { TaskService } from '../services/task.service';

export interface TaskFilters {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  search: string;
}

@Injectable({ providedIn: 'root' })
export class TaskStore {
  private readonly taskService = inject(TaskService);

  // State
  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly filters = signal<TaskFilters>({ status: '', priority: '', search: '' });

  // Computed
  readonly filteredTasks = computed(() => {
    let result = this.tasks();
    const f = this.filters();

    if (f.status) {
      result = result.filter(t => t.status === f.status);
    }
    if (f.priority) {
      result = result.filter(t => t.priority === f.priority);
    }
    if (f.search) {
      const term = f.search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term)
      );
    }

    return result;
  });

  readonly taskCount = computed(() => this.filteredTasks().length);
  readonly totalCount = computed(() => this.tasks().length);

  readonly tasksByStatus = computed(() => {
    const tasks = this.tasks();
    return {
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      done: tasks.filter(t => t.status === 'DONE').length
    };
  });

  constructor() {
    // Effect: persist filters to localStorage
    effect(() => {
      const currentFilters = this.filters();
      localStorage.setItem('taskFilters', JSON.stringify(currentFilters));
    });

    // Restore filters from localStorage
    const saved = localStorage.getItem('taskFilters');
    if (saved) {
      try {
        this.filters.set(JSON.parse(saved));
      } catch {
        // ignore invalid JSON
      }
    }
  }

  loadTasks(): void {
    this.loading.set(true);
    this.error.set(null);
    this.taskService.getAll().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load tasks. Is the API server running?');
        this.loading.set(false);
      }
    });
  }

  setFilters(filters: TaskFilters): void {
    this.filters.set(filters);
  }

  updateStatus(id: number, status: TaskStatus): void {
    this.taskService.update(id, { status }).subscribe({
      next: (updated) => {
        this.tasks.update(tasks => tasks.map(t => t.id === id ? updated : t));
      },
      error: () => {
        this.error.set('Failed to update task status.');
      }
    });
  }

  deleteTask(id: number): void {
    this.taskService.delete(id).subscribe({
      next: () => {
        this.tasks.update(tasks => tasks.filter(t => t.id !== id));
      },
      error: () => {
        this.error.set('Failed to delete task.');
      }
    });
  }

  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    this.loading.set(true);
    this.taskService.create(task).subscribe({
      next: (created) => {
        this.tasks.update(tasks => [...tasks, created]);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to create task.');
        this.loading.set(false);
      }
    });
  }

  updateTask(id: number, changes: Partial<Task>): void {
    this.taskService.update(id, changes).subscribe({
      next: (updated) => {
        this.tasks.update(tasks => tasks.map(t => t.id === id ? updated : t));
      },
      error: () => {
        this.error.set('Failed to update task.');
      }
    });
  }
}
