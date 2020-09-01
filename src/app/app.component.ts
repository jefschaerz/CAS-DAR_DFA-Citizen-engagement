import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { AuthService } from './security/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'citizen-engagement';
  isUserLogged: boolean;
  loggedUserName: string;
  loggedUserHref: string;
  loggedUserRoles: any;
  isMenuCollapsed = true;
  isLoggedUserStaff: boolean

  constructor(public authService: AuthService) {
    // Could be necessary to set the version or boostrap used
    setTheme('bs4');
  }

  ngOnInit() {
    // Subscribe to any change of the isAuthenticated and set an internal value
    // to provide also this info to the template (html)
    this.authService.isAuthenticated().subscribe(loggedUser => {
      this.isUserLogged = loggedUser;
      console.log('Log ', loggedUser);
    });

    // Get logged user name info
    this.authService.getUser().subscribe(user => {
      // Add ? to check before if it is defined user (in case of not logged)
      this.loggedUserName = user?.name;
      this.loggedUserHref = user?.href;
      this.loggedUserRoles = user?.roles;
      console.log(' @@@ Changes : Logged user is ', user);
      console.log('Logged role ', this.loggedUserRoles);
      // Check if user is staff or citizen
      this.isLoggedUserStaff = (this.loggedUserRoles?.indexOf('staff') > -1);
      console.log('Logged user is staff ? ', this.isLoggedUserStaff);
    });

  }
}
