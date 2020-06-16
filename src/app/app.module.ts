// Importation de modules Javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DummyPageComponent } from './dummy-page/dummy-page.component';
import { LoginPageComponent } from './security/login-page/login-page.component';
import { LogoutButtonComponent } from './security/logout-button/logout-button.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ApiTokenInterceptorService } from "./api/api-token-interceptor.service";

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
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ApiTokenInterceptorService,
    multi: true,
  },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
