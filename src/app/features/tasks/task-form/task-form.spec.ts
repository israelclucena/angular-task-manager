import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TaskForm } from './task-form';

describe('TaskForm', () => {
  let component: TaskForm;
  let fixture: ComponentFixture<TaskForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskForm],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize in create mode by default', () => {
    expect(component.isEditMode()).toBeFalse();
  });

  it('should have an invalid form when empty', () => {
    component.form.controls.title.setValue('');
    component.form.controls.dueDate.setValue('');
    expect(component.form.valid).toBeFalse();
  });

  it('should require title', () => {
    component.form.controls.title.setValue('');
    component.form.controls.title.markAsTouched();
    expect(component.form.controls.title.hasError('required')).toBeTrue();
  });

  it('should validate title minimum length (trimmed)', () => {
    component.form.controls.title.setValue('ab');
    component.form.controls.title.markAsTouched();
    expect(component.form.controls.title.hasError('minLengthTrimmed')).toBeTrue();
  });

  it('should reject whitespace-only title as too short', () => {
    component.form.controls.title.setValue('   ');
    component.form.controls.title.markAsTouched();
    expect(component.form.controls.title.hasError('minLengthTrimmed')).toBeTrue();
  });

  it('should accept valid title', () => {
    component.form.controls.title.setValue('Valid Task Title');
    expect(component.form.controls.title.hasError('required')).toBeFalse();
    expect(component.form.controls.title.hasError('minLengthTrimmed')).toBeFalse();
  });

  it('should require due date', () => {
    component.form.controls.dueDate.setValue('');
    component.form.controls.dueDate.markAsTouched();
    expect(component.form.controls.dueDate.hasError('required')).toBeTrue();
  });

  it('should reject past due dates', () => {
    component.form.controls.dueDate.setValue('2020-01-01');
    component.form.controls.dueDate.markAsTouched();
    expect(component.form.controls.dueDate.hasError('futureDate')).toBeTrue();
  });

  it('should accept future due dates', () => {
    component.form.controls.dueDate.setValue('2027-12-31');
    expect(component.form.controls.dueDate.hasError('futureDate')).toBeFalse();
  });

  it('should have valid form with all fields filled correctly', () => {
    component.form.patchValue({
      title: 'My new task',
      description: 'Some description',
      priority: 'HIGH',
      status: 'TODO',
      categoryId: 1,
      dueDate: '2027-06-15'
    });
    expect(component.form.valid).toBeTrue();
  });

  it('should not submit when form is invalid', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.form.controls.title.setValue('');
    component.onSubmit();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should track unsaved changes', () => {
    expect(component.hasUnsavedChanges()).toBeFalse();
    component.form.controls.title.setValue('Changed');
    expect(component.hasUnsavedChanges()).toBeTrue();
  });
});
