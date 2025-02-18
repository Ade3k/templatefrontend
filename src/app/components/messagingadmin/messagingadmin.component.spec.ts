import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagingadminComponent } from './messagingadmin.component';

describe('MessagingadminComponent', () => {
  let component: MessagingadminComponent;
  let fixture: ComponentFixture<MessagingadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagingadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagingadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
