import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  numberAttribute,
  type OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControlDirective,
  FormControlName,
  NgControl,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { type ErrorStateMatcher } from '@angular/material/core';
import { MatFormField, MatInput } from '@angular/material/input';

import { filter, first } from 'rxjs';

import { NoopValueAccessorDirective, TimeInputBehaviourDirective } from '../directives';
import { isNil } from '../utils';

@Component({
  standalone: true,
  selector: 'mat-time-input',
  templateUrl: './time-input.component.html',
  styleUrl: './time-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NoopValueAccessorDirective],
  imports: [ReactiveFormsModule, MatInput, TimeInputBehaviourDirective],
})
export class TimeInputComponent implements OnInit {
  public readonly id = input('');

  public readonly name = input('');

  public readonly placeholder = input('hh:mm');

  public readonly readonly = input(false, { transform: booleanAttribute });

  public readonly required = input(false, { transform: booleanAttribute });

  public readonly tabindex = input(undefined, { transform: numberAttribute });

  public readonly errorStateMatcher = input<ErrorStateMatcher>();

  protected isRequired = computed<boolean>(() => {
    return this.required() || !!this.ngControl?.control?.hasValidator(Validators.required);
  });

  private readonly destroyRef = inject(DestroyRef);

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected readonly ngControl = inject(NgControl, {
    self: true,
    optional: true,
  });

  private readonly formField = inject(MatFormField, {
    host: true,
    optional: true,
  });

  private readonly inputRef = viewChild.required(MatInput);

  constructor() {
    if (isNil(this.ngControl)) {
      throw new Error('No provider for NgControl found in TimeInputComponent');
    }

    const isSupportedType =
      this.ngControl instanceof FormControlDirective ||
      this.ngControl instanceof FormControlName ||
      this.ngControl instanceof NgModel;

    if (!isSupportedType) {
      throw new Error('Provided unsupported type of NgControl in TimeInputComponent');
    }
  }

  public ngOnInit(): void {
    if (!isNil(this.formField)) {
      this.formField._control = this.inputRef();
    }

    if (!isNil(this.ngControl?.control)) {
      this.ngControl.control.statusChanges
        .pipe(
          filter((status) => status === 'DISABLED'),
          first(),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => this.changeDetectorRef.detectChanges());
    }
  }
}
