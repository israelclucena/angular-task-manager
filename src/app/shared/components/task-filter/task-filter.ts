import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskStatus, TaskPriority } from '../../models/task.model';

export interface TaskFilters {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  search: string;
}

@Component({
  selector: 'app-task-filter',
  imports: [FormsModule],
  templateUrl: './task-filter.html',
  styleUrl: './task-filter.scss'
})
export class TaskFilter {
  filtersChange = output<TaskFilters>();

  status: TaskStatus | '' = '';
  priority: TaskPriority | '' = '';
  search = '';

  onFilterChange(): void {
    this.filtersChange.emit({
      status: this.status,
      priority: this.priority,
      search: this.search
    });
  }

  onClear(): void {
    this.status = '';
    this.priority = '';
    this.search = '';
    this.onFilterChange();
  }
}
