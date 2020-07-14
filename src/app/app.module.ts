// Importation de modules Javascript
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AlertsModule } from './alerts/alerts.module'
import { AppComponent } from './app.component';
import { DebuggingPageComponent } from './debugging-page/debugging-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiTokenInterceptorService } from "./api/api-token-interceptor.service";
import { SecurityModule } from './security/security.module';
import { NewregistrationPageComponent } from './newregistration-page/newregistration-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MessagesComponent } from './messages/messages.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { ManageissueComponent } from './issues/manageissue/manageissue.component';
import { ListissuesComponent } from './issues/listissues/listissues.component';
import { MapComponent } from './issues/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

// Import dans notre module
@NgModule({
  // Declar COMPONENTS of modules
  declarations: [
    AppComponent,
    DebuggingPageComponent,
    NewregistrationPageComponent,
    MessagesComponent,
    UserMenuComponent,
    ManageissueComponent,
    ListissuesComponent, MapComponent
  ],
  // Import other Angular MODULES
  imports: [
    BrowserModule,
    LeafletModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, SecurityModule, BrowserAnimationsModule, AlertsModule, BsDropdownModule.forRoot(), AlertModule.forRoot()
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
