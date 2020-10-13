import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssuesRoutingModule } from './issues-routing.module';
import { ManageissueComponent } from './manageissue/manageissue.component';
import { ListissuesComponent } from './listissues/listissues.component';
import { MapComponent } from '../map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ManageissuecommentsComponent } from './manageissuecomments/manageissuecomments.component';
import { AlertsModule } from '../alerts/alerts.module'
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { IssuetypesComponent } from './issuetypes/issuetypes.component';

@NgModule({
  declarations: [ManageissueComponent,
    ListissuesComponent,
    MapComponent,
    ManageissuecommentsComponent,
    IssuetypesComponent],
  imports: [
    CommonModule,
    LeafletModule,
    IssuesRoutingModule,
    FormsModule, AlertsModule, CollapseModule.forRoot(), PaginationModule.forRoot()
  ],
  exports: [ManageissueComponent, ListissuesComponent, ManageissuecommentsComponent, MapComponent
  ]
})
export class IssuesModule { }
