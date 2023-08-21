import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { trigger, transition, animate, style } from '@angular/animations'


@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':increment', [
        style({ opacity: 0.1 }),
        animate('1.5s ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ opacity: 0.1 }),
        animate('1.5s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AnnouncementsComponent implements OnInit {

  announcemnt: any;
  announcemntData: any;
  announcemnttimer: any;
  carouselValue = 0;
  isLoadingCompelete = true;
  @Input() langDirection:any;
  announcemntContent: any;
  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    // this.announcements()

  }

  ngOnChanges(){
    if(this.langDirection)
    {
      this.announcements()
    }
  }

  announcements() {
    this.isLoadingCompelete = false;
    this.dashboardService.getAnnouncementsInfo().subscribe((response: any) => {
      this.isLoadingCompelete = true;
      this.announcemntData = response
      this.announcemnt = this.announcemntData.DATA.ALL_RECORDS[this.carouselValue].WELCOMEMESSAGE;
      this.announcemntContent = this.announcemntData.DATA.ALL_RECORDS[this.carouselValue].BULLETIN;
      this.announcemnttimer = setInterval(() => { this.announcementInfoInterval() }, 5000);
    }, error => {
      this.isLoadingCompelete = true;
    })
  }
  carouselbtn(data:any) {
    clearInterval(this.announcemnttimer);
    this.carouselValue=data
    this.announcemnt = this.announcemntData.DATA.ALL_RECORDS[this.carouselValue].WELCOMEMESSAGE;
    this.announcemntContent = this.announcemntData.DATA.ALL_RECORDS[this.carouselValue].BULLETIN;
    this.announcemnttimer = setInterval(() => { this.announcementInfoInterval() }, 5000)
  }

  announcementInfoInterval() {
    if (this.announcemntData.DATA.ALL_RECORDS.length - 1 == this.carouselValue) {
      this.carouselValue = 0;
    }
    else {
      this.carouselValue += 1;
    }
    this.carouselbtn(this.carouselValue)
  }
}
