import { Component } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'citizen-engagement';
  greeting = 'Test';

  constructor() {
    // Could be ncessary to set the version or boostrap used
    setTheme('bs4'); // or 'bs4'
  }
}
