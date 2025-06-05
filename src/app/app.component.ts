import { Component } from '@angular/core';
import { DashboardComponent } from "./dashboard/components/board/dashboard/dashboard.component";
import { HomeComponent } from "./dashboard/components/home/home.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lefi-frontend';
}
