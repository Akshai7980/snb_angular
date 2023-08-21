import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { SettingsService } from '../../services/settings.service';
import { applyRightTheme } from 'src/app/utility/common-utility';

@Component({
  selector: 'app-appearance',
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.scss']
})
export class AppearanceComponent implements OnInit {
  rootScopeData: RootScopeDeclare = RootScopeData;
  selectedFont: any;
  fontSize:any;
  themes: any;
  isDarkModeChecked:any;
  themeName = '';
  fonticons = [
    { index:0, icon: 'A', class: 'fontsmall', value: 'small' },
    { index:1, icon: 'A', class: 'fontmedium', value: 'medium' },
    { index:2, icon: 'A', class: 'fontlarge', value: 'large' }
  ];
  constructor(private settingsService:SettingsService,private router: Router) { 
    this.rootScopeData.settingsActiveTabName = 'appearance'
  }

  ngOnInit(): void {
    this.getAppearanceData();
  }
  fontselected(res: any): void {
    this.selectedFont = res;
    this.fontSize=this.fonticons[res].value;
  }

  onDarkModeChange(){
    this.isDarkModeChecked = !this.isDarkModeChecked;
  }

  getAppearanceData(){
    this.themeName = this.rootScopeData.userInfo.themeColour;
    this.fontSize=this.rootScopeData.userInfo.fontSize;
    if(this.rootScopeData.userInfo.darkMode === 'true'  ||  this.rootScopeData.userInfo.darkMode === true){
      this.isDarkModeChecked=true;
    }
    else if(this.rootScopeData.userInfo.darkMode === 'false'  ||  this.rootScopeData.userInfo.darkMode === false){
        this.isDarkModeChecked=false;
    }
    this.selectedFontClass();
  }

  colorbtn(value: any, tName: string) {
    this.themes = value;
    this.themeName = tName;
  }

  selectedFontClass(){
    if(this.fontSize === "small" || this.fontSize === "large"){
    for(let i=0; i<this.fonticons.length; i++){
      if(this.fontSize === this.fonticons[i].value){
        this.selectedFont=this.fonticons[i].index;
      } 
    }
  }
  else{
    this.fontSize = "medium";
    for(let i=0; i<this.fonticons.length; i++){
      if(this.fontSize === this.fonticons[i].value){
        this.selectedFont=this.fonticons[i].index;
      }
    }
  }
  }

  onClickSave(){
    let vdarkMode;
    if(this.isDarkModeChecked === true){
      vdarkMode = "Y"
    }else{
      vdarkMode = "N"
    }
    let params = {
      darkMode:vdarkMode,
      themeColor:this.themeName,
      fontSize:this.fontSize
    }
    
    this.settingsService.saveAppearanceApiCall(params).subscribe((res: any) => {
      if(res.data.data === "SUCCESS"){
        this.rootScopeData.userInfo.themeColour = this.themeName;
        this.rootScopeData.userInfo.darkMode = this.isDarkModeChecked ? 'true' : 'false';
        applyRightTheme(this.themeName, this.isDarkModeChecked);
       this.router.navigate(['/dashboard'])
      }
   }, error => {

   });

  }

  onClickResetdefault(){
    this.getAppearanceData();
  }
  

}
