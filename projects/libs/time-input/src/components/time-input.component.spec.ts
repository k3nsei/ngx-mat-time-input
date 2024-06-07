import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeInputComponent } from './time-input.component';

describe('TimeInputComponent', () => {
  let component: TimeInputComponent;
  let fixture: ComponentFixture<TimeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});