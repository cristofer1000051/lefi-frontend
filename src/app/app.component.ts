import { Component } from '@angular/core';
import { DashboardComponent } from "./dashboard/components/board/dashboard/dashboard.component";
import { HomeComponent } from "./dashboard/components/home/home.component";

@Component({
  selector: 'app-root',
  imports: [HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lefi-frontend';
}
