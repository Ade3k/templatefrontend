import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsadminComponent } from './postsadmin.component';

describe('PostsadminComponent', () => {
  let component: PostsadminComponent;
  let fixture: ComponentFixture<PostsadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
