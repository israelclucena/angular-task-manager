import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal, computed, WritableSignal } from '@angular/core';
import { TaskList } from './task-list';
import { TaskStore } from '../../../core/store/task.store';
import { Task } from '../../../shared/models/task.model';

const mockTasks: Task[] = [
  {
    id: 1, title: 'Task 1', description: 'Description 1',
    status: 'TODO', priority: 'HIGH', categoryId: 1,
    dueDate: '2026-03-01', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z'
  },
  {
    id: 2, title: 'Task 2', description: 'Description 2',
    status: 'IN_PROGRESS', priority: 'MEDIUM', categoryId: 2,
    dueDate: '2026-03-15', createdAt: '2026-02-02T00:00:00Z', updatedAt: '2026-02-02T00:00:00Z'
  },
  {
    id: 3, title: 'Task 3', description: 'Description 3',
    status: 'DONE', priority: 'LOW', categoryId: 1,
    dueDate: '2026-02-20', createdAt: '2026-02-03T00:00:00Z', updatedAt: '2026-02-03T00:00:00Z'
  }
];

describe('TaskList', () => {
  let component: TaskList;
  let fixture: ComponentFixture<TaskList>;
  let router: Router;

  let loadingSignal: WritableSignal<boolean>;
  let errorSignal: WritableSignal<string | null>;
  let tasksSignal: WritableSignal<Task[]>;
  let mockStore: any;

  beforeEach(async () => {
    loadingSignal = signal(false);
    errorSignal = signal<string | null>(null);
    tasksSignal = signal(mockTasks);

    mockStore = {
      tasks: tasksSignal,
      loading: loadingSignal,
      error: errorSignal,
      filters: signal({ status: '', priority: '', search: '' }),
      filteredTasks: computed(() => tasksSignal()),
      taskCount: computed(() => tasksSignal().length),
      totalCount: computed(() => tasksSignal().length),
      tasksByStatus: computed(() => ({ todo: 1, inProgress: 1, done: 1 })),
      loadTasks: jasmine.createSpy('loadTasks'),
      setFilters: jasmine.createSpy('setFilters'),
      deleteTask: jasmine.createSpy('deleteTask'),
      updateStatus: jasmine.createSpy('updateStatus')
    };

    await TestBed.configureTestingModule({
      imports: [TaskList],
      providers: [
        provideRouter([]),
        { provide: TaskStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskList);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    expect(mockStore.loadTasks).toHaveBeenCalled();
  });

  it('should display task count', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.task-count')?.textContent).toContain('3 tasks');
  });

  it('should render task cards', () => {
    const el = fixture.nativeElement as HTMLElement;
    const cards = el.querySelectorAll('app-task-card');
    expect(cards.length).toBe(3);
  });

  it('should show loading state', () => {
    loadingSignal.set(true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.loading')?.textContent).toContain('Loading');
  });

  it('should show error state', () => {
    errorSignal.set('Something went wrong');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.error p')?.textContent).toContain('Something went wrong');
  });

  it('should call store.deleteTask on delete', () => {
    component.onDeleteTask(1);
    expect(mockStore.deleteTask).toHaveBeenCalledWith(1);
  });

  it('should call store.updateStatus on status change', () => {
    component.onStatusChange({ id: 1, status: 'IN_PROGRESS' });
    expect(mockStore.updateStatus).toHaveBeenCalledWith(1, 'IN_PROGRESS');
  });

  it('should navigate to edit on editTask', () => {
    spyOn(router, 'navigate');
    component.onEditTask(mockTasks[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/tasks', 1, 'edit']);
  });

  it('should update filters when filter changes', () => {
    const filters = { status: 'TODO' as const, priority: '' as const, search: '' };
    component.onFiltersChange(filters);
    expect(mockStore.setFilters).toHaveBeenCalledWith(filters);
  });
});
