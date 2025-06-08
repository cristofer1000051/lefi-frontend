import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { navbarData } from './navbarData';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as icons from '@fortawesome/free-solid-svg-icons';

const iconNames = Object
  .values(icons)
  .filter((icon: any) => icon.prefix === 'fas')
  .map((icon: any) => icon.iconName);

console.log(iconNames);
@Component({
  selector: 'app-menu',
  imports: [RouterModule,FontAwesomeModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  public collapsed: boolean
  navData=navbarData;
  constructor(){
    this.collapsed=false;
  }
  isCollapsed():void{
    this.collapsed = !this.collapsed;
  }
}
