import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PtoAdminComponent } from './pto-admin.component';

describe('PtoAdminComponent', () => {
  let component: PtoAdminComponent;
  let fixture: ComponentFixture<PtoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PtoAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PtoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
