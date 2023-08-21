import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  selectedLanguage: string = "";
  selectedAmountFormat: string = "";
  selectedDateFormat: string = "";
  selectedTimeZone: string = "";
  isLoadingCompelete = true;
  isShownlanguageError = false;
  isShownamountError = false;
  isShowndateformatError = false;
  isShowntimezoneError = false;
  constructor(private settingsService: SettingsService, private router: Router) {
    this.rootScopeData.settingsActiveTabName = 'preferences'
  }

  ngOnInit(): void {
    this.getPreferencesData();
  }

  getPreferencesData() {
    this.selectedLanguage = this.rootScopeData.userInfo.mLanguage;
    this.selectedAmountFormat = this.rootScopeData.userInfo.mAmtFormat;
    this.selectedDateFormat = this.rootScopeData.userInfo.mDateFormat;
    this.selectedTimeZone = this.rootScopeData.userInfo.mTimeZoneId;
  }

  onClickSave() {
    let params = {
      language: this.selectedLanguage,
      amountFormat: this.selectedAmountFormat,
      dateFormat: this.selectedDateFormat,
      timeZone: this.selectedTimeZone
    }
    this.isShownlanguageError = this.selectedLanguage ? false : true;
    this.isShownamountError = this.selectedAmountFormat ? false : true;
    this.isShowndateformatError = this.selectedDateFormat ? false : true;
    this.isShowntimezoneError = this.selectedTimeZone ? false : true;
    if (!this.isShownlanguageError && !this.isShownamountError && !this.isShowndateformatError && !this.isShowntimezoneError) {
      this.isLoadingCompelete = false;
      this.settingsService.savePreferenceApiCall(params).subscribe((res: any) => {
        this.isLoadingCompelete = true;
        if (res.data.data === "SUCCESS") {
          this.rootScopeData.userInfo.mLanguage = this.selectedLanguage;
          this.rootScopeData.userInfo.mAmtFormat = this.selectedAmountFormat;
          this.rootScopeData.userInfo.mDateFormat = this.selectedDateFormat;
          this.rootScopeData.userInfo.mTimeZoneId = this.selectedTimeZone;

          this.router.navigate(['/dashboard'])
        }
      }, (error: any) => {
        this.isLoadingCompelete = true;
      }

      );

    }
  }


  onClickResetDefault() {
    this.getPreferencesData();
  }

}
