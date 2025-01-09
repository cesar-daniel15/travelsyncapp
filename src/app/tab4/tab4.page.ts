import { Component, OnInit } from '@angular/core';

import { LanguageService } from '../services/language.service'; 
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
  }

  switchLanguage(language: string) {
    this.languageService.setLanguage(language);
  }
  
  getCurrentLanguage() {
    return this.languageService.getLanguage();
  }

}
