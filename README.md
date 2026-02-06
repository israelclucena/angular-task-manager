# Task Manager — Angular 20 + Claude Code

A full-featured Task Manager built with **Angular 20** as a progressive study project demonstrating modern Angular patterns and Claude Code productivity benefits across 7 modules.

## Tech Stack

- **Angular 20.3** — standalone components, Signals, new control flow (`@for`, `@if`, `@empty`)
- **TypeScript 5.9** — strict mode
- **SCSS** — component-scoped styling
- **json-server** — mock REST API
- **Karma / Jasmine** — 58 unit tests

## Quick Start

```bash
# Install dependencies
npm install

# Start the mock API (port 3000)
npm run api

# Start the dev server (port 4200)
npm start

# Run tests
npm test
```

## Architecture

```
src/app/
├── core/
│   ├── guards/           # unsavedChangesGuard (functional CanDeactivateFn)
│   ├── interceptors/     # apiInterceptor (base URL + error handling)
│   ├── resolvers/        # taskResolver (functional ResolveFn)
│   ├── services/         # TaskService, CategoryService (CRUD over HTTP)
│   └── store/            # TaskStore (signal-based state management)
├── features/
│   ├── tasks/
│   │   ├── task-list/    # Smart component — fetches from store, manages routing
│   │   └── task-form/    # Reactive forms — create/edit with custom validators
│   └── not-found/        # 404 page
└── shared/
    ├── components/
    │   ├── task-card/    # Dumb component — input()/output() signal APIs
    │   └── task-filter/  # Search + status/priority filters
    ├── models/           # Task, Category, TaskStatus, TaskPriority interfaces
    └── validators/       # minLengthTrimmed, futureDateValidator
```

## Modules Breakdown

### Module 1 — Project Foundation & Scaffolding
- `json-server` with seed data (6 tasks, 5 categories)
- Shared TypeScript models (`Task`, `Category`, `TaskStatus`, `TaskPriority`)
- `provideHttpClient()` with interceptor setup in app config
- App shell with nav header and router-outlet

### Module 2 — Core Service Layer & HTTP
- `TaskService` — full CRUD (`GET`, `POST`, `PATCH`, `DELETE`)
- `CategoryService` — category lookups
- `apiInterceptor` — prepends `http://localhost:3000` base URL, logs errors
- Unit tests for both services

### Module 3 — Task List & Component Architecture
- **Smart/Dumb component pattern**: `TaskList` (smart) delegates to `TaskCard` (dumb)
- `TaskCard` uses Angular 20 `input.required<Task>()` and `output()` signal APIs
- `TaskFilter` — search box + status/priority dropdowns
- Modern control flow: `@for` with `track`, `@if`/`@else if`, `@empty`
- Lazy-loaded routes via `loadComponent()`

### Module 4 — Forms & Validation
- `TaskForm` with Reactive Forms — reused for both create and edit (route param detection)
- Custom validators: `minLengthTrimmed(3)` trims whitespace before checking, `futureDateValidator` rejects past dates
- Routes: `/tasks/new`, `/tasks/:id/edit`

### Module 5 — State Management with Signals
- `TaskStore` — centralized state using `signal()`, `computed()`, `effect()`
- Computed signals: `filteredTasks`, `taskCount`, `tasksByStatus`
- `effect()` persists filters to `localStorage` automatically
- Components refactored from direct service calls to store methods

### Module 6 — Guards, Resolvers & Advanced Routing
- `taskResolver` — functional `ResolveFn<Task>`, prefetches task data on edit routes
- `unsavedChangesGuard` — functional `CanDeactivateFn`, prompts on dirty form navigation
- `NotFound` component with wildcard route
- All routes use `loadComponent` for lazy loading

### Module 7 — Testing & Debugging
- **58 tests across 8 spec files** — all passing
- Integration tests for `TaskList` with mocked signal-based store
- Form validation tests for `TaskForm` (required, min length, future date)
- Validator unit tests, `TaskCard` component tests, `TaskStore` state tests
- Bug fixes discovered during testing:
  - `minLengthTrimmed` validator: fixed handling of whitespace-only strings
  - Store mocking: use standalone `WritableSignal` variables instead of `jasmine.createSpyObj` properties

## Key Angular 20 Patterns Demonstrated

| Pattern | Where |
|---------|-------|
| Standalone components (no NgModules) | Every component |
| Signal inputs: `input()` / `input.required()` | `TaskCard` |
| Signal outputs: `output()` | `TaskCard` |
| Signal-based state: `signal()`, `computed()`, `effect()` | `TaskStore` |
| Modern control flow: `@for`, `@if`, `@empty` | `TaskList`, `TaskCard`, `TaskForm` |
| Functional guards: `CanDeactivateFn` | `unsavedChangesGuard` |
| Functional resolvers: `ResolveFn` | `taskResolver` |
| Lazy loading: `loadComponent()` | `app.routes.ts` |
| Functional interceptors: `HttpInterceptorFn` | `apiInterceptor` |

## API Endpoints (json-server)

| Method | URL | Description |
|--------|-----|-------------|
| `GET` | `/tasks` | List all tasks |
| `GET` | `/tasks/:id` | Get task by ID |
| `POST` | `/tasks` | Create a task |
| `PATCH` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |
| `GET` | `/categories` | List all categories |

## License

MIT
