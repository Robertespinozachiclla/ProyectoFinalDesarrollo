import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Daswoard } from './daswoard';

describe('Daswoard', () => {
  let component: Daswoard;
  let fixture: ComponentFixture<Daswoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Daswoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Daswoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
