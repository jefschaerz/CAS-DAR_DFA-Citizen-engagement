import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from "@angular/common";
import { LoginPageComponent } from './security/login-page/login-page.component';
import { DebuggingPageComponent } from './debugging-page/debugging-page.component';
import { NewregistrationPageComponent } from './newregistration-page/newregistration-page.component';
import { AuthGuard } from './security/guards/auth.guard';
import { ManageissueComponent } from './issues/manageissue/manageissue.component';
import { ListissuesComponent } from './issues/listissues/listissues.component';
import { ManageissuecommentsComponent } from './issues/manageissuecomments/manageissuecomments.component';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  // Add this default route to redirect to debugg
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginPageComponent },
  { path: "newregistration", component: NewregistrationPageComponent },

  // Add the route to display the debugging page
  {
    path: "seeissues", component: ListissuesComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
  {
    path: "addissue", component: ManageissueComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
  {
    path: "editissue/:id", component: ManageissueComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
  {
    path: "editissue/:id/comments", component: ManageissuecommentsComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
  {
    path: "debugging", component: DebuggingPageComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
  {
    path: "map", component: MapComponent,
    // Prevent access to this page to unauthenticated users
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "seeissues", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
