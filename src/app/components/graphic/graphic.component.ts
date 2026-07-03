import { Component } from '@angular/core';

@Component({
  selector: 'app-graphic',
  imports: [],
  templateUrl: './graphic.component.html',
  styleUrl: './graphic.component.css'
})
export class GraphicComponent {

  public navItem:string = 'General';

  public navItemChange(item: string) {
    this.navItem = item;
  }
}
