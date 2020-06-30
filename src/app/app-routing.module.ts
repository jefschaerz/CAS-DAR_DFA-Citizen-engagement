import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Added manually by JFS
import { LoginPageComponent } from './security/login-page/login-page.component';
import { DebuggingPageComponent } from './debugging-page/debugging-page.component';
import { NewregistrationPageComponent } from './newregistration-page/newregistration-page.component';
import { AuthGuard } from './security/guards/auth.guard';

const routes: Routes = [
  // Add this default route to redirect to debugg
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginPageComponent },
  { path: "newregistration", component: NewregistrationPageComponent },

  // Add the route to display the debugging page
  {
    path: "seeissue", component: DebuggingPageComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
  {
    path: "debugging", component: DebuggingPageComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
