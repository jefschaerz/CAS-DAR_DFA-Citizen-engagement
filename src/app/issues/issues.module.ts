import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssuesRoutingModule } from './issues-routing.module';
import { ManageissueComponent } from './manageissue/manageissue.component';
import { ListissuesComponent } from './listissues/listissues.component';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [ManageissueComponent, ListissuesComponent, MapComponent],
  imports: [
    CommonModule,
    LeafletModule,
    IssuesRoutingModule
  ],
  exports: [ManageissueComponent, ListissuesComponent, MapComponent]
})
export class IssuesModule { }
