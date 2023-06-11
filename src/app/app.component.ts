import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

interface Item  {
  name: string,
  active: boolean,
}

const items: Item[] = [
  {name: 'hello', active: false},
  {name: 'angular', active: true}
]

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
}
