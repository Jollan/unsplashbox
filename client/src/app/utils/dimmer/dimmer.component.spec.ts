import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DimmerComponent } from './dimmer.component';

describe('DimmerComponent', () => {
  let component: DimmerComponent;
  let fixture: ComponentFixture<DimmerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DimmerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DimmerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
