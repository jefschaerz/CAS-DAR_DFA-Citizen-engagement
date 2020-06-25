import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// Added manually by JFS
import {LoginPageComponent} from './security/login-page/login-page.component';
import {DummyPageComponent} from './dummy-page/dummy-page.component';
import {NewregistrationformComponent} from './newregistration/newregistrationform/newregistrationform.component';
import {AuthGuard} from './security/guards/auth.guard';

const routes: Routes = [
  // Add this default route to redirect to dummy
  { path: "", redirectTo: "dummy", pathMatch: "full" },
  { path: "login", component: LoginPageComponent },
  { path: "newregistration", component: NewregistrationformComponent },

  // Add the route to display the dummy page
  { path: "seeissue", component: DummyPageComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
