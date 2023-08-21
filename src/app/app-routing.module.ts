import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { DashboardBaseComponent } from './dashboard/components/dashboard-base/dashboard-base.component';

const routes: Routes = [
  { path:'' , redirectTo:'/dashboard', pathMatch:'full'},
  { path: 'dashboard' , component:DashboardBaseComponent},
  { path: 'accounts', loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule) }, 
  { path: 'payments', loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule) },
  { path: 'notifications', loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule) },
  { path: 'mytask', loadChildren: () => import('./mytask/mytask.module').then(m => m.MytaskModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) },
  { path: 'sadad',loadChildren:()=>import('./sadad/sadad.module').then(m=>m.SadadModule)},
  {path:'transactionInquiry',loadChildren:()=>import('./transaction-inquiry/transaction-inquiry.module').then(m=>m.TransactionInquiryModule)},
  {path:'aramco',loadChildren:()=>import('./aramco/aramco.module').then(m=>m.AramcoModule)},
  { path:'configurationManagement',loadChildren:()=>import('./configuration-management/configuration-management.module').then(m=>m.ConfigurationManagementModule)},
  { path: 'payroll', loadChildren: () => import('./payroll/payroll.module').then(m => m.PayrollModule) },
  {path:'cards',loadChildren:()=>import('./cards/cards.module').then(m=>m.CardsModule)},
  {path:'epay',loadChildren:()=>import('./e-pay/e-pay.module').then(m=>m.EPayModule)},
  {path:'eTrade', loadChildren:() => import('./e-trade/e-trade.module').then(m => m.ETradeModule)},
  {path:'pos',loadChildren:()=>import('./pos/pos.module').then(m=>m.PosModule)},
  {path:'ticketInquiry',loadChildren:()=>import('./ticket-inquiry/ticket-inquiry.module').then(m=>m.TicketInquiryModule)},
  {path:'posFinance',loadChildren:()=>import('./pos-finance/pos-finance.module').then(m=>m.PosFinanceModule)},
  {path:'eFinance',loadChildren:()=>import('./e-finance/e-finance.module').then(m=>m.EFinanceModule)},
  {path:'digitalHub', loadChildren:()=> import('./digital-hub/digital-hub.module').then(m => m.DigitalHubModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
