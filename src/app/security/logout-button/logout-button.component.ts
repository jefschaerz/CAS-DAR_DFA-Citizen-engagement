import { Component, OnInit } from "@angular/core";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-logout-button",
  // Define html code directly here because very short
  template: '<button (click)="logout()">Logout</button>',
})
export class LogoutButtonComponent {
  constructor(private auth: AuthService, private router: Router) { }

  // Logout method 
  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl("/login");
  }
}
