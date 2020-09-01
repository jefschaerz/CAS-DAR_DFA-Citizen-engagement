import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssuesRoutingModule } from './issues-routing.module';
import { ManageissueComponent } from './manageissue/manageissue.component';
import { ListissuesComponent } from './listissues/listissues.component';
import { MapComponent } from '../map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FilterissuesComponent } from './filterissues/filterissues.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ManageissuecommentsComponent } from './manageissuecomments/manageissuecomments.component';
import { AlertsModule } from '../alerts/alerts.module'

@NgModule({
  declarations: [ManageissueComponent, ListissuesComponent, MapComponent, FilterissuesComponent, ManageissuecommentsComponent],
  imports: [
    CommonModule,
    LeafletModule,
    IssuesRoutingModule,
    FormsModule, AlertsModule, CollapseModule.forRoot()
  ],
  exports: [ManageissueComponent, ListissuesComponent, MapComponent]
})
export class IssuesModule { }
