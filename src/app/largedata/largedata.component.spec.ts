import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargedataComponent } from './largedata.component';

describe('LargedataComponent', () => {
  let component: LargedataComponent;
  let fixture: ComponentFixture<LargedataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LargedataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
