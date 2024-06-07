import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { TimeInputComponent } from 'ngx-mat-time-input';

@Component({
  standalone: true,
  selector: 'ex-app',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, FormsModule, MatFormFieldModule, MatIconModule, TimeInputComponent],
})
export class AppComponent {
  protected readonly form = new FormGroup({
    time: new FormControl('15:28', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected time2 = signal('11:46');
}
