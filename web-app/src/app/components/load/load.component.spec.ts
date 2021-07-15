import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LoadComponent} from './load.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

describe('LoadComponent', () => {
  let component: LoadComponent;
  let fixture: ComponentFixture<LoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatProgressSpinnerModule
      ],
      declarations: [LoadComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
