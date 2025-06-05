import { Routes } from '@angular/router';
import { HomeComponent } from './dashboard/components/home/home.component';
<<<<<<< HEAD
import { DashboardComponent } from './dashboard/components/board/dashboard/dashboard.component';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path: 'home',component: HomeComponent},
    {path: 'board',component:DashboardComponent}
=======
import { BoardComponent } from './dashboard/components/board/dashboard/board.component';


export const routes: Routes = [
    {path: '',redirectTo:'home',pathMatch:'full'},
    {path: 'home',component: HomeComponent},
    {path: 'board',component:BoardComponent}
>>>>>>> 43ed58537363a287e864c777b61af733caad2471
];

