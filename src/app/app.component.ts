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
  greeting = 'Test';
  isUserLogged: boolean;
  loggedUserName: string;
  isMenuCollapsed = true;

  constructor(public authService: AuthService) {
    // Could be necessary to set the version or boostrap used
    setTheme('bs4');

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
      console.log('Logged user is ', user);
    });
  }
}
