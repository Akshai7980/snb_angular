import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DigitalHubRoutingModule } from './digital-hub-routing.module';
import { DigitalHubComponent } from './components/digital-hub/digital-hub.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    DigitalHubComponent
  ],
  imports: [
    CommonModule,
    CommonComponentsModule,
    SharedModule,
    DigitalHubRoutingModule
  ]
})
export class DigitalHubModule { }
