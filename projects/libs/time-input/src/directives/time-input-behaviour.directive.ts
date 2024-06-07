import { ChangeDetectorRef, DestroyRef, Directive, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

import { isNil, withLeadingZero } from '../utils';

const NUM_KEYS = Array.from({ length: 10 }, (_, i) => `${i}`);

@Directive({
  standalone: true,
  selector: 'input[timeInputBehaviour]',
  host: {
    '(click)': 'handleClick()',
    '(keydown)': 'handleKeyDown($event)',
  },
  exportAs: 'timeInputBehaviour',
})
export class TimeInputBehaviourDirective {
  private readonly destroyRef = inject(DestroyRef);

  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  private readonly ngControl = inject(NgControl, { self: true });

  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef, { self: true });

  private animationFrameRequestRef: ReturnType<typeof requestAnimationFrame> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.cancelAnimationFrame());
  }

  private get value(): string {
    return this.ngControl.value || '';
  }

  private set value(value: string | null | undefined) {
    this.ngControl.control?.setValue(value || '', { onlySelf: true });

    this.ngControl.control?.markAsDirty();
    this.ngControl.control?.markAsTouched();

    this.changeDetectorRef.markForCheck();
  }

  private get hour(): number | null {
    const hour: number = parseInt(/^([0-1][0-9]|2[0-3])/.exec(this.value)?.[1] || '');

    return !Number.isNaN(hour) ? hour : null;
  }

  private get minute(): number | null {
    const minute: number = parseInt(/:([0-5][0-9])$/.exec(this.value)?.[1] || '');

    return !Number.isNaN(minute) ? minute : null;
  }

  public handleClick(): void {
    this.updateSelectionRange();
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      return;
    }

    if (NUM_KEYS.includes(event.key)) {
      return this.typing(event);
    }

    event.preventDefault();

    const element = this.elementRef.nativeElement;

    if (event.key === 'ArrowLeft') {
      return this.updateSelectionRange('hour');
    }

    if (event.key === 'ArrowRight') {
      return this.updateSelectionRange('minute');
    }

    const selectionStart = element.selectionStart ?? 0;
    const selectionEnd = element.selectionEnd ?? 0;

    if (['Backspace', 'Delete'].includes(event.key)) {
      return this.clear(selectionStart, selectionEnd);
    }

    if (event.key === 'ArrowUp') {
      return selectionStart <= 2 ? this.stepHourUp() : this.stepMinuteUp();
    }

    if (event.key === 'ArrowDown') {
      return selectionStart <= 2 ? this.stepHourDown() : this.stepMinuteDown();
    }
  }

  private typing(event: KeyboardEvent): void {
    const element = this.elementRef.nativeElement;

    const selectionStart = element.selectionStart ?? 0;
    const selectionEnd = element.selectionEnd ?? 0;

    if (
      selectionStart > 4 ||
      (selectionStart === 0 && !NUM_KEYS.slice(0, 3).includes(event.key)) ||
      (selectionStart === 1 && this.value.at(0) === '2' && !NUM_KEYS.slice(0, 4).includes(event.key)) ||
      (selectionStart === 3 && !NUM_KEYS.slice(0, 6).includes(event.key))
    ) {
      return event.preventDefault();
    }

    if (selectionEnd - selectionStart > 2) {
      element.setSelectionRange(0, 2);
    }

    if (element.selectionStart === 1) {
      this.updateSelectionRange('minute');
    }

    this.changeDetectorRef.markForCheck();
  }

  private clear(selectionStart: number, selectionEnd: number): void {
    if (selectionEnd - selectionStart > 2) {
      return this.updateValueAndSelectionRange('hh', 'mm', 'hour');
    }

    if (selectionStart <= 2) {
      const mm = withLeadingZero(this.minute ?? 'mm');

      return this.updateValueAndSelectionRange('hh', mm, 'hour');
    }

    const hh = withLeadingZero(this.hour ?? 'hh');

    this.updateValueAndSelectionRange(hh, 'mm', 'minute');
  }

  private stepHourUp(): void {
    const hour = this.hour ?? 0;

    const hh = withLeadingZero(hour < 23 ? hour + 1 : 0);
    const mm = withLeadingZero(this.minute ?? 'mm');

    this.updateValueAndSelectionRange(hh, mm, 'hour');
  }

  private stepHourDown(): void {
    const hour = this.hour ?? 0;

    const hh = withLeadingZero(hour > 0 ? hour - 1 : 23);
    const mm = withLeadingZero(this.minute ?? 'mm');

    this.updateValueAndSelectionRange(hh, mm, 'hour');
  }

  private stepMinuteUp(): void {
    const minute = this.minute ?? 0;

    const hh = withLeadingZero(this.hour ?? 'hh');
    const mm = withLeadingZero(minute < 59 ? minute + 1 : 0);

    this.updateValueAndSelectionRange(hh, mm, 'minute');
  }

  private stepMinuteDown(): void {
    const minute = this.minute ?? 0;

    const hh = withLeadingZero(this.hour ?? 'hh');
    const mm = withLeadingZero(minute > 0 ? minute - 1 : 59);

    this.updateValueAndSelectionRange(hh, mm, 'minute');
  }

  private updateValueAndSelectionRange(hh: string, mm: string, type: 'hour' | 'minute'): void {
    this.value = `${hh}:${mm}`;

    this.updateSelectionRange(type);
  }

  public updateSelectionRange(type?: 'hour' | 'minute' | null): void {
    const element = this.elementRef.nativeElement;

    if (isNil(type)) {
      const selectionStart = element.selectionStart || 0;

      type = selectionStart <= 2 ? 'hour' : 'minute';
    }

    const [start, end] = type === 'hour' ? [0, 2] : [3, 5];

    this.cancelAnimationFrame();

    this.animationFrameRequestRef = requestAnimationFrame(() => {
      element.setSelectionRange(start, end);

      this.changeDetectorRef.markForCheck();
    });
  }

  private cancelAnimationFrame(): void {
    if (!isNil(this.animationFrameRequestRef)) {
      cancelAnimationFrame(this.animationFrameRequestRef);
    }
  }
}
