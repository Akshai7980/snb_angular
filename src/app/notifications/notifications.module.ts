import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { NotificationParentComponent } from './components/notification-parent/notification-parent.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { MailboxComponent } from './components/mailbox/mailbox.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { SentComponent } from './components/sent/sent.component';
import { DraftsComponent } from './components/drafts/drafts.component';
import { TrashComponent } from './components/trash/trash.component';
import { TrashNotificationsComponent } from './components/trash-notifications/trash-notifications.component';
import { TrashMailboxComponent } from './components/trash-mailbox/trash-mailbox.component';
import { NotificationComponent } from './components/notification/notification.component';
import { SharedModule } from '../shared/shared.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';


@NgModule({
  declarations: [
    NotificationsComponent,
    NotificationParentComponent,
    AlertsComponent,
    AnnouncementsComponent,
    MailboxComponent,
    InboxComponent,
    SentComponent,
    DraftsComponent,
    TrashComponent,
    TrashNotificationsComponent,
    TrashMailboxComponent,
    NotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    SharedModule,
    CommonComponentsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule
  ]
})
export class NotificationsModule { }
