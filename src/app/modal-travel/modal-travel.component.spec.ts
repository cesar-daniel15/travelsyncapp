import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 

import { ModalTravelComponent } from './modal-travel.component';

describe('ModalTravelComponent', () => {
  let component: ModalTravelComponent;
  let fixture: ComponentFixture<ModalTravelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTravelComponent ],
      imports: [IonicModule.forRoot(),FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalTravelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
