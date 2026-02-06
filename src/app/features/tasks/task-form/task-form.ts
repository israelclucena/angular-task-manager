import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../core/services/task.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category, Task, TaskPriority, TaskStatus } from '../../../shared/models/task.model';
import { minLengthTrimmed, futureDateValidator } from '../../../shared/validators/task.validators';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss'
})
export class TaskForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  categories = signal<Category[]>([]);
  isEditMode = signal(false);
  taskId = signal<number | null>(null);
  loading = signal(false);
  formDirty = signal(false);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, minLengthTrimmed(3)]],
    description: [''],
    priority: ['MEDIUM' as TaskPriority, [Validators.required]],
    status: ['TODO' as TaskStatus, [Validators.required]],
    categoryId: [1, [Validators.required]],
    dueDate: ['', [Validators.required, futureDateValidator]]
  });

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => this.categories.set(cats));

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode.set(true);
      this.taskId.set(+idParam);
      this.loadTask(+idParam);
    }

    this.form.valueChanges.subscribe(() => this.formDirty.set(true));
  }

  private loadTask(id: number): void {
    this.loading.set(true);
    this.taskService.getById(id).subscribe({
      next: (task) => {
        this.form.patchValue({
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          categoryId: task.categoryId,
          dueDate: task.dueDate
        });
        this.loading.set(false);
        this.formDirty.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    this.loading.set(true);

    if (this.isEditMode() && this.taskId()) {
      this.taskService.update(this.taskId()!, formValue).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => this.loading.set(false)
      });
    } else {
      this.taskService.create(formValue).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: () => this.loading.set(false)
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }

  hasUnsavedChanges(): boolean {
    return this.formDirty();
  }
}
