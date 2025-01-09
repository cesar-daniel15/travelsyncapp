import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private defaultLanguage: string = 'en'; 

  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.defaultLanguage);
    this.translate.use(this.defaultLanguage);
  }

  setLanguage(language: string) {
    this.defaultLanguage = language;
    this.translate.use(language);
  }

  getLanguage(): string {
    return this.defaultLanguage;
  }
}