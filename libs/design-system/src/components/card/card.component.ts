import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'lib-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card bg-base-100 shadow-xl">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent {}

@Component({
  selector: 'lib-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-body">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardHeaderComponent {}

@Component({
  selector: 'lib-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="card-title">
      <ng-content></ng-content>
    </h2>
  `,
})
export class CardTitleComponent {}

@Component({
  selector: 'lib-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p class="text-base-content/70">
      <ng-content></ng-content>
    </p>
  `,
})
export class CardDescriptionComponent {}

@Component({
  selector: 'lib-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mt-4">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardContentComponent {}
