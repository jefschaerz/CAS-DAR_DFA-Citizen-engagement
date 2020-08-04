import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssuesRoutingModule } from './issues-routing.module';
import { ManageissueComponent } from './manageissue/manageissue.component';
import { ListissuesComponent } from './listissues/listissues.component';
import { MapComponent } from '../map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FilterissuesComponent } from './filterissues/filterissues.component';

@NgModule({
  declarations: [ManageissueComponent, ListissuesComponent, MapComponent, FilterissuesComponent],
  imports: [
    CommonModule,
    LeafletModule,
    IssuesRoutingModule,
    FormsModule
  ],
  exports: [ManageissueComponent, ListissuesComponent, MapComponent]
})
export class IssuesModule { }
