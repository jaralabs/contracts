import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div style="padding: 2rem;">
      <h1>🏠 Host Application</h1>
      <p>Welcome to the main host application!</p>
      <nav style="margin-top: 2rem;">
        <a
          routerLink="/signature"
          style="padding: 10px 20px; background: #1976d2; color: white; text-decoration: none; border-radius: 4px;"
        >
          Go to Signature Module
        </a>
      </nav>
    </div>
  `,
})
export class HomePageComponent {}
