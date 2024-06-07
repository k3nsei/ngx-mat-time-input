import { Directive } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { noop } from '../utils';

@Directive({
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NoopValueAccessorDirective,
      multi: true,
    },
  ],
})
export class NoopValueAccessorDirective implements ControlValueAccessor {
  public writeValue = noop;
  public registerOnChange = noop;
  public registerOnTouched = noop;
}
