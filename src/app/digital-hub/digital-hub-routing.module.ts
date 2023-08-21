import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DigitalHubComponent } from './components/digital-hub/digital-hub.component';

const routes: Routes = [
  {
    path: '', component: DigitalHubComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalHubRoutingModule { }
