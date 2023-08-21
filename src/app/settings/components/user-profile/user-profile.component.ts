import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { environment } from 'src/environments/environment';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  rootScopeData:RootScopeDeclare=RootScopeData;
  profilePicUrl: any;
  showInvalidFileError = false;
  msg = "";
  url: any="assets/images/blank-profile-picture.png"; 
  filemanager_addfile:any;
  filemanager_addfile_name:any;
  fileExtension: any;
  isLoadingCompelete: boolean = true;
  userProfiledata: any = "";
  constructor(private settingsService: SettingsService,private router:Router) { 
    this.rootScopeData.settingsActiveTabName = 'userProfile'
  }

  ngOnInit(): void {
    this.rootScopeData.randomeNumber = new Date().getTime();
    this.profilePicUrl = `${environment.retriveUserImage}`;
    this.getUserData();
    // this.profilePicUrl = "../../../../assets/images/blank-profile-picture.png"
    // this.profilePicUrl = "../../../../assets/images/userProfile.jpg"
  }

  getUserData(){
    this.isLoadingCompelete = false;
    this.settingsService.getUserProfileData().subscribe(
      (response:any)=>{ 
        this.isLoadingCompelete = true;
        if(response.data){
          this.userProfiledata = response.data;
        }
      }, error => {
        this.isLoadingCompelete = true;
        // this.rootScopeData.showSystemError = true;
      })

  }

  selectFile(event: any): any { 
    this.showInvalidFileError = false;
    
		this.filemanager_addfile=event.target.files[0];
    this.fileExtension = '.'+this.filemanager_addfile.name.split('.').pop().toLowerCase();
    if(this.fileExtension !== '.jpg' && this.fileExtension !== '.jpeg' && this.fileExtension !== '.gif' && this.fileExtension !== '.bmp' && this.fileExtension !== '.png') {
      this.showInvalidFileError = true;
      return false;
    }
    this.filemanager_addfile_name=this.filemanager_addfile.name
    var formData: any = new FormData();
    formData.append("bulkfile",this.filemanager_addfile,this.filemanager_addfile_name);
    formData.append('INPUT_ACTION','STORE_USER_IMAGE');
    this.isLoadingCompelete = false;
    this.settingsService.fileUpload(formData).subscribe(
      response=>{ 
        this.isLoadingCompelete = true;
        if(response.success === 'true') {
          this.showInvalidFileError = false;
        }else if(response.success === 'false') {
          this.showInvalidFileError = true;
        }
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
          this.msg = "";
          this.url = reader.result; 
        }
        this.ngOnInit();
      }, error => {
        this.isLoadingCompelete = true;
        // this.rootScopeData.showSystemError = true;
      })
	
	}
  onClickBack(){
    this.router.navigate([this.rootScopeData.urlMapping.HOME])
  }


}
