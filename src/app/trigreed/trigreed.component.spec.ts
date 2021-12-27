import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrigreedComponent } from './trigreed.component';

describe('TrigreedComponent', () => {
  let component: TrigreedComponent;
  let fixture: ComponentFixture<TrigreedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrigreedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrigreedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
