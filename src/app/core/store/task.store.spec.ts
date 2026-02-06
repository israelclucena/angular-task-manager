import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskStore } from './task.store';
import { Task } from '../../shared/models/task.model';

describe('TaskStore', () => {
  let store: TaskStore;
  let httpTesting: HttpTestingController;

  const mockTasks: Task[] = [
    {
      id: 1, title: 'Task 1', description: 'Desc 1',
      status: 'TODO', priority: 'HIGH', categoryId: 1,
      dueDate: '2026-03-01', createdAt: '2026-02-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z'
    },
    {
      id: 2, title: 'Task 2', description: 'Desc 2',
      status: 'DONE', priority: 'LOW', categoryId: 2,
      dueDate: '2026-03-15', createdAt: '2026-02-02T00:00:00Z', updatedAt: '2026-02-02T00:00:00Z'
    }
  ];

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    store = TestBed.inject(TaskStore);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should load tasks', () => {
    store.loadTasks();
    const req = httpTesting.expectOne('/tasks');
    req.flush(mockTasks);

    expect(store.tasks().length).toBe(2);
    expect(store.loading()).toBeFalse();
  });

  it('should set error on load failure', () => {
    store.loadTasks();
    const req = httpTesting.expectOne('/tasks');
    req.error(new ProgressEvent('error'));

    expect(store.error()).toBeTruthy();
    expect(store.loading()).toBeFalse();
  });

  it('should compute filtered tasks by status', () => {
    store.loadTasks();
    httpTesting.expectOne('/tasks').flush(mockTasks);

    store.setFilters({ status: 'TODO', priority: '', search: '' });
    expect(store.filteredTasks().length).toBe(1);
    expect(store.filteredTasks()[0].title).toBe('Task 1');
  });

  it('should compute filtered tasks by search', () => {
    store.loadTasks();
    httpTesting.expectOne('/tasks').flush(mockTasks);

    store.setFilters({ status: '', priority: '', search: 'Task 2' });
    expect(store.filteredTasks().length).toBe(1);
    expect(store.filteredTasks()[0].id).toBe(2);
  });

  it('should compute tasksByStatus', () => {
    store.loadTasks();
    httpTesting.expectOne('/tasks').flush(mockTasks);

    const stats = store.tasksByStatus();
    expect(stats.todo).toBe(1);
    expect(stats.done).toBe(1);
    expect(stats.inProgress).toBe(0);
  });

  it('should delete a task', () => {
    store.loadTasks();
    httpTesting.expectOne('/tasks').flush(mockTasks);

    store.deleteTask(1);
    httpTesting.expectOne('/tasks/1').flush(null);

    expect(store.tasks().length).toBe(1);
    expect(store.tasks()[0].id).toBe(2);
  });

  it('should update task status', () => {
    store.loadTasks();
    httpTesting.expectOne('/tasks').flush(mockTasks);

    store.updateStatus(1, 'IN_PROGRESS');
    const req = httpTesting.expectOne('/tasks/1');
    req.flush({ ...mockTasks[0], status: 'IN_PROGRESS' });

    expect(store.tasks().find(t => t.id === 1)?.status).toBe('IN_PROGRESS');
  });
});
