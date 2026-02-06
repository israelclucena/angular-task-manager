import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { Category } from '../../shared/models/task.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpTesting: HttpTestingController;

  const mockCategories: Category[] = [
    { id: 1, name: 'Architecture', color: '#6366f1' },
    { id: 2, name: 'Backend', color: '#f59e0b' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CategoryService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all categories', () => {
    service.getAll().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
      expect(categories.length).toBe(2);
    });

    const req = httpTesting.expectOne('/categories');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should fetch a category by id', () => {
    service.getById(1).subscribe(category => {
      expect(category).toEqual(mockCategories[0]);
    });

    const req = httpTesting.expectOne('/categories/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories[0]);
  });
});
