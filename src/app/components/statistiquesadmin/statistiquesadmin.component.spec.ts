import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatistiquesadminComponent } from './statistiquesadmin.component';

describe('StatistiquesadminComponent', () => {
  let component: StatistiquesadminComponent;
  let fixture: ComponentFixture<StatistiquesadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatistiquesadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatistiquesadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
