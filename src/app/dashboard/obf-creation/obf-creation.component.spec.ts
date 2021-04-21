import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObfCreationComponent } from './obf-creation.component';

describe('ObfCreationComponent', () => {
  let component: ObfCreationComponent;
  let fixture: ComponentFixture<ObfCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObfCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObfCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
