import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersadminComponent } from './usersadmin.component';

describe('UsersadminComponent', () => {
  let component: UsersadminComponent;
  let fixture: ComponentFixture<UsersadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
