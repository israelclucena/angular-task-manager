import { Component, input, output } from '@angular/core';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss'
})
export class TaskCard {
  task = input.required<Task>();

  edit = output<Task>();
  delete = output<number>();
  statusChange = output<{ id: number; status: Task['status'] }>();

  get priorityClass(): string {
    return `priority-${this.task().priority.toLowerCase()}`;
  }

  get statusClass(): string {
    return `status-${this.task().status.toLowerCase().replace('_', '-')}`;
  }

  onEdit(): void {
    this.edit.emit(this.task());
  }

  onDelete(): void {
    this.delete.emit(this.task().id);
  }

  onToggleStatus(): void {
    const current = this.task().status;
    const next: Task['status'] = current === 'TODO' ? 'IN_PROGRESS'
      : current === 'IN_PROGRESS' ? 'DONE'
      : 'TODO';
    this.statusChange.emit({ id: this.task().id, status: next });
  }
}
