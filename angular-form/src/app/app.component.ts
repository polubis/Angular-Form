import { Component } from '@angular/core';
import { Setting, filterSettings } from "src/app/components/form/form.model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-form';
  settings: Setting[] = filterSettings;
  
}
