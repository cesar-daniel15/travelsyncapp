import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';


import { FavoriteTripsPage } from './tab3.page';

describe('FavoriteTripsPage', () => {
  let component: FavoriteTripsPage;
  let fixture: ComponentFixture<FavoriteTripsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteTripsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteTripsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
