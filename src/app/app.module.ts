// Importation de modules Javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DebuggingPageComponent } from './debugging-page/debugging-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiTokenInterceptorService } from "./api/api-token-interceptor.service";
import { SecurityModule } from './security/security.module';
import { NewregistrationPageComponent } from './newregistration-page/newregistration-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertsComponent } from './alerts/alerts.component';
import { MessagesComponent } from './messages/messages.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

// Import dans notre module
@NgModule({
  // Declar COMPONENTS of modules
  declarations: [
    AppComponent,
    DebuggingPageComponent,
    NewregistrationPageComponent,
    AlertsComponent,
    MessagesComponent,
    UserMenuComponent
  ],
  // Import other Angular MODULES
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, SecurityModule, BrowserAnimationsModule, BsDropdownModule.forRoot(), AlertModule.forRoot()
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiTokenInterceptorService,
    multi: true,
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
