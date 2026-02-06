import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>Page not found</p>
      <a routerLink="/tasks" class="back-link">Back to Tasks</a>
    </div>
  `,
  styles: [`
    .not-found {
      text-align: center;
      padding: 4rem 2rem;
    }

    h1 {
      font-size: 4rem;
      font-weight: 800;
      color: #6366f1;
      margin: 0;
    }

    p {
      font-size: 1.25rem;
      color: #64748b;
      margin: 0.5rem 0 2rem 0;
    }

    .back-link {
      display: inline-block;
      padding: 0.625rem 1.5rem;
      background: #6366f1;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: background 0.15s;

      &:hover {
        background: #4f46e5;
      }
    }
  `]
})
export class NotFound {}
