import { Component } from '@angular/core';
<<<<<<< HEAD
import { DashboardComponent } from "./dashboard/components/board/dashboard/dashboard.component";
import { HomeComponent } from "./dashboard/components/home/home.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
=======
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule],
>>>>>>> 43ed58537363a287e864c777b61af733caad2471
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lefi-frontend';
}
