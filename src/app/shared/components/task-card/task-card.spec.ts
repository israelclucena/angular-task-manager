import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCard } from './task-card';
import { Task } from '../../models/task.model';
import { ComponentRef } from '@angular/core';

describe('TaskCard', () => {
  let component: TaskCard;
  let componentRef: ComponentRef<TaskCard>;
  let fixture: ComponentFixture<TaskCard>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'TODO',
    priority: 'HIGH',
    categoryId: 1,
    dueDate: '2026-03-01',
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCard]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCard);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('task', mockTask);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the task title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.card-title')?.textContent).toContain('Test Task');
  });

  it('should display the priority badge', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.priority-badge')?.textContent).toContain('HIGH');
  });

  it('should display the due date', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.due-date')?.textContent).toContain('2026-03-01');
  });

  it('should emit edit event', () => {
    spyOn(component.edit, 'emit');
    component.onEdit();
    expect(component.edit.emit).toHaveBeenCalledWith(mockTask);
  });

  it('should emit delete event with task id', () => {
    spyOn(component.delete, 'emit');
    component.onDelete();
    expect(component.delete.emit).toHaveBeenCalledWith(1);
  });

  it('should emit statusChange with next status (TODO -> IN_PROGRESS)', () => {
    spyOn(component.statusChange, 'emit');
    component.onToggleStatus();
    expect(component.statusChange.emit).toHaveBeenCalledWith({ id: 1, status: 'IN_PROGRESS' });
  });

  it('should show Start button for TODO status', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.btn-status')?.textContent?.trim()).toBe('Start');
  });
});
