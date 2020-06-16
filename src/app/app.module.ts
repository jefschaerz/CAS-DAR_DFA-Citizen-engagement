// Importation de modules Javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//TODO Check if correct 
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { DummyPageComponent } from './dummy-page/dummy-page.component';
import { LoginPageComponent } from './security/login-page/login-page.component';
import { LogoutButtonComponent } from './security/logout-button/logout-button.component';

// import dans notre module
@NgModule({
  // Declar COMPONENTS of modules
  declarations: [
    AppComponent,
    DummyPageComponent,
    LoginPageComponent,
    LogoutButtonComponent
  ],
  // Import other Angular MODULES
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, 
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
