import { Component, OnInit } from '@angular/core';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor() { }

  ngOnInit(): void {
  }
  security_Click(){
    if(this.rootScopeData.userInfo.mLanguage === 'en_US'){
      window.open("/iportalweb/iportal/jsps/security/security-en.html")
    }
    else if(this.rootScopeData.userInfo.mLanguage === 'ar_SA'){
      window.open("/iportalweb/iportal/jsps/security/security-ar.html")
    }    
  }
  career_Click(){
    window.open("https://careers.alahli.com/")
  }
  cons_prod_Click(){
    window.open("https://www.alahli.com/en-us/Pages/Consumer-Protection.aspx")
  }
  snb_capital_Click(){
    window.open("https://www.alahlicapital.com/Pages/Home.aspx")
  }
}
