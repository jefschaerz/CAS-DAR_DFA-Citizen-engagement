import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginPageComponent } from './login-page/login-page.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';
import { AlertsModule } from '../alerts/alerts.module'
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [LoginPageComponent, LogoutButtonComponent],
  imports: [
    CommonModule, FormsModule, AlertsModule
  ],
  exports: [LoginPageComponent, LogoutButtonComponent]
})
export class SecurityModule { }
