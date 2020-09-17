// Importation de modules Javascript
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { ManageissuecommentsComponent } from './issues/manageissuecomments/manageissuecomments.component';
import { MapComponent } from './map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { FilterissuesComponent } from './issues/filterissues/filterissues.component';
import { FilterPipe } from './shared/tools/filter.pipe';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PaginationModule } from 'ngx-bootstrap/pagination';

// import { environment } from "../environments/environment";

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
    ManageissuecommentsComponent,
    FilterPipe,
    ListissuesComponent,
    MapComponent,
    FilterissuesComponent,
    FooterComponent,
    HeaderComponent
  ],
  // Import other Angular MODULES
  imports: [
    BrowserModule,
    LeafletModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SecurityModule,
    BrowserAnimationsModule,
    AlertsModule,
    NgxSpinnerModule,
    BsDropdownModule.forRoot(), PaginationModule.forRoot(), CollapseModule.forRoot(), AlertModule.forRoot()
  ],
  //For ngx-spinner
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiTokenInterceptorService,
    multi: true,
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
