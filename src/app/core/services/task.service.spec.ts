import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../../shared/models/task.model';

describe('TaskService', () => {
  let service: TaskService;
  let httpTesting: HttpTestingController;

  const mockTask: Task = {
    id: 1,
    title: 'Test task',
    description: 'Test description',
    status: 'TODO',
    priority: 'MEDIUM',
    categoryId: 1,
    dueDate: '2026-03-01',
    createdAt: '2026-02-01T10:00:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TaskService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all tasks', () => {
    const mockTasks: Task[] = [mockTask];

    service.getAll().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpTesting.expectOne('/tasks');
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);
  });

  it('should fetch a task by id', () => {
    service.getById(1).subscribe(task => {
      expect(task).toEqual(mockTask);
    });

    const req = httpTesting.expectOne('/tasks/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockTask);
  });

  it('should create a task', () => {
    const newTask = {
      title: 'New task',
      description: 'New description',
      status: 'TODO' as const,
      priority: 'HIGH' as const,
      categoryId: 2,
      dueDate: '2026-04-01'
    };

    service.create(newTask).subscribe(task => {
      expect(task.title).toBe('New task');
    });

    const req = httpTesting.expectOne('/tasks');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.title).toBe('New task');
    expect(req.request.body.createdAt).toBeTruthy();
    expect(req.request.body.updatedAt).toBeTruthy();
    req.flush({ ...newTask, id: 7, createdAt: req.request.body.createdAt, updatedAt: req.request.body.updatedAt });
  });

  it('should update a task', () => {
    const changes = { title: 'Updated title' };

    service.update(1, changes).subscribe(task => {
      expect(task.title).toBe('Updated title');
    });

    const req = httpTesting.expectOne('/tasks/1');
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.title).toBe('Updated title');
    expect(req.request.body.updatedAt).toBeTruthy();
    req.flush({ ...mockTask, ...changes });
  });

  it('should delete a task', () => {
    service.delete(1).subscribe();

    const req = httpTesting.expectOne('/tasks/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
