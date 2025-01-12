import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 

import { ModalLocationsCommentsComponent } from './modal-locations-comments.component';

describe('ModalLocationsCommentsComponent', () => {
  let component: ModalLocationsCommentsComponent;
  let fixture: ComponentFixture<ModalLocationsCommentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLocationsCommentsComponent ],
      imports: [IonicModule.forRoot(),FormsModule,IonicModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalLocationsCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
