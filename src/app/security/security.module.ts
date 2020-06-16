import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms' ;
import { LoginPageComponent } from './login-page/login-page.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';

@NgModule({
  declarations: [LoginPageComponent, LogoutButtonComponent],
  imports: [
    CommonModule, FormsModule
  ],
  exports : [LoginPageComponent, LogoutButtonComponent]
})
export class SecurityModule { }
