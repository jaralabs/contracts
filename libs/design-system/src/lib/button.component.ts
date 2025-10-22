import { Component } from '@angular/core';

@Component({
  selector: 'lib-button',
  standalone: true,
  template: `
    <button
      style="padding:10px 20px;background:#1976d2;color:#fff;border:none;border-radius:4px;cursor:pointer"
    >
      Design Button
    </button>
  `,
})
export class DsButtonComponent {}
