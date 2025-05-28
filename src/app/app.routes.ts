import { Routes } from '@angular/router';
import { HomeComponent } from './dashboard/components/home/home.component';
import { BoardComponent } from './dashboard/components/board/dashboard/board.component';


export const routes: Routes = [
    {path: '',redirectTo:'home',pathMatch:'full'},
    {path: 'home',component: HomeComponent},
    {path: 'board',component:BoardComponent}
];

