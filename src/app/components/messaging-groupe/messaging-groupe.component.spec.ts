import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingGroupeComponent } from './messaging-groupe.component';

describe('MessagingGroupeComponent', () => {
  let component: MessagingGroupeComponent;
  let fixture: ComponentFixture<MessagingGroupeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagingGroupeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagingGroupeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
