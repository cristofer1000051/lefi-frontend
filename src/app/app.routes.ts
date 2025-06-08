import { Routes } from '@angular/router';
import { HomeComponent } from './dashboard/components/home/home.component';
import { DashboardComponent } from './dashboard/components/board/dashboard/dashboard.component';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path: 'home',component: HomeComponent},
    {path: 'board',component:DashboardComponent}
];

