import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; 

import { ModalLocationComponent } from './modal-location.component';
import { TranslateModule } from '@ngx-translate/core';


describe('ModalLocationComponent', () => {
  let component: ModalLocationComponent;
  let fixture: ComponentFixture<ModalLocationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalLocationComponent ],
      imports: [IonicModule.forRoot(),FormsModule,TranslateModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
