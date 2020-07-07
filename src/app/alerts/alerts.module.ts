import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertsComponent } from './alerts.component';

// The AlertsModule encapsulates the alert component so it can be imported 
// and used by other Angular modules.

// To use in other module :
/*
import { AlertService } from '../alerts/alerts.service';
Add in constructor : public alertService: AlertService 
*/

@NgModule({
    imports: [CommonModule],
    declarations: [AlertsComponent],
    exports: [AlertsComponent]
})
export class AlertsModule { }