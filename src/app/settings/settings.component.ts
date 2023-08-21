import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from '../rootscope-data';
import { RootScopeDeclare } from '../rootscope-declare';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  constructor(private route: Router) {
    this.rootScopeData.settingsActiveTabName = 'preferences'
   }

  ngOnInit(): void {}


  // selectMenu_click(val:any){
  //   if(val === "Preferences")
  //   {
  //     this.route.navigate(['/settings/preferences'])
  //   }
  //   else if(val === "userProfile"){
  //     this.route.navigate(['/settings/userProfile'])
  //   }
  //    else if(val === "appearance"){
  //     this.route.navigate(['/settings/appearance'])
  //   }
  //   else if(val === "manageAlerts"){
  //     this.route.navigate(['/settings/manageAlerts'])
  //   }
  //   else if(val === "changePassword"){
  //     this.route.navigate(['/settings/changePassword'])
  //   }
    
  // }
}
