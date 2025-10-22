import { Component, OnInit } from '@angular/core';
import { DsButtonComponent } from '@contracts/design-system';

@Component({
  selector: 'app-signature-page',
  standalone: true,
  imports: [DsButtonComponent],
  template: `
    <h1>🚀 Microfront: Signature</h1>
    <lib-button></lib-button>
  `,
})
export class SignaturePageComponent implements OnInit {
  ngOnInit() {
    console.log('✅ SignaturePageComponent initialized');
  }
}
