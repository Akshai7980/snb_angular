import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlertsComponent } from './components/alerts/alerts.component';
import { AnnouncementsComponent } from './components/announcements/announcements.component';
import { DraftsComponent } from './components/drafts/drafts.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { MailboxComponent } from './components/mailbox/mailbox.component';
import { NotificationParentComponent } from './components/notification-parent/notification-parent.component';
import { NotificationComponent } from './components/notification/notification.component';
import { SentComponent } from './components/sent/sent.component';
import { TrashMailboxComponent } from './components/trash-mailbox/trash-mailbox.component';
import { TrashNotificationsComponent } from './components/trash-notifications/trash-notifications.component';
import { TrashComponent } from './components/trash/trash.component';
import { NotificationsComponent } from './notifications.component';

const routes: Routes = [{ path: '', component: NotificationsComponent, 
children:[
  { path: '', redirectTo: '/notifications/notification/alerts', pathMatch: 'full' },
  { path: 'notification', component: NotificationParentComponent,
  children: [
    { path: '', redirectTo: '/alerts', pathMatch: 'full' },
    { path: 'alerts', component: AlertsComponent },
    { path: 'notifications', component: NotificationComponent },
    { path: 'announcements', component: AnnouncementsComponent}
  ]
},
{ path: 'mailbox', component: MailboxComponent,
    children: [
      { path: '', redirectTo: '/notifications/mailbox/inbox', pathMatch: 'full' },
      { path: 'inbox', component: InboxComponent },
      { path: 'sent', component: SentComponent },
      { path: 'drafts', component: DraftsComponent }
    ]
  },
  { path: 'trash', component: TrashComponent,
  children: [
    { path: '', redirectTo: '/notifications/trash/trash-mailboxs', pathMatch: 'full' },
    { path: 'trash-mailboxs', component: TrashMailboxComponent }
  ]
 }



]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationsRoutingModule { }
