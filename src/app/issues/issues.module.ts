import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IssuesRoutingModule } from './issues-routing.module';
import { ManageissueComponent } from './manageissue/manageissue.component';


@NgModule({
  declarations: [ManageissueComponent],
  imports: [
    CommonModule,
    IssuesRoutingModule
  ]
})
export class IssuesModule { }
