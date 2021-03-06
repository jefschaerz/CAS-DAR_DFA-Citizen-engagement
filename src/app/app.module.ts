// Importation de modules Javascript
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PaginationModule } from 'ngx-bootstrap/pagination';
/* Routing Module */
import { AppRoutingModule } from './app-routing.module';
/* Feature Modules */
import { AlertsModule } from './alerts/alerts.module';
import { IssuesModule } from './issues/issues.module';
import { SecurityModule } from './security/security.module';
/* App Root */
import { AppComponent } from './app.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiTokenInterceptorService } from "./api/api-token-interceptor.service";
import { NewregistrationPageComponent } from './newregistration-page/newregistration-page.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { MapComponent } from './map/map.component';
import { FilterPipe } from './shared/tools/filter.pipe';
import { MarkerPositionService } from './shared/services/markerposition.service';

// Import in our module
@NgModule({
  // Declare COMPONENTS of modules
  declarations: [
    AppComponent,
    NewregistrationPageComponent,
    UserMenuComponent,
    FilterPipe,
  ],
  // Import other Angular MODULES
  imports: [
    BrowserModule,
    LeafletModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    IssuesModule,
    SecurityModule,
    BrowserAnimationsModule,
    AlertsModule,
    NgxSpinnerModule,
    BsDropdownModule.forRoot(), PaginationModule.forRoot(), CollapseModule.forRoot(), AlertModule.forRoot()
  ],
  // For ngx-spinner
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiTokenInterceptorService,
    multi: true,
  },
    MarkerPositionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
