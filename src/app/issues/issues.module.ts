import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssuesRoutingModule } from './issues-routing.module';
import { ManageissueComponent } from './manageissue/manageissue.component';
import { ListissuesComponent } from './listissues/listissues.component';


@NgModule({
  declarations: [ManageissueComponent, ListissuesComponent],
  imports: [
    CommonModule,
    IssuesRoutingModule
  ]
})
export class IssuesModule { }
