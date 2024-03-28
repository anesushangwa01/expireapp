import { Routes } from '@angular/router';
import {ViewComponent} from './view/view.component';
import  {HeaderComponent}  from './header/header.component';
import { AddproductsComponent } from './addproducts/addproducts.component';
import {OAuthComponent} from './oauth/oauth.component';
import {LoginComponent} from  './login/login.component';
import { HomeComponent} from  './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: '/view', pathMatch: 'full' },
    { path: 'view/:type', component: ViewComponent},
    { path: 'header', component: HeaderComponent },
    { path: 'view/:type', component: ViewComponent },
    {path: 'addproduct', component: AddproductsComponent},
    { path: 'edit/:id', component: AddproductsComponent},
    {path: 'oauth', component: OAuthComponent},
    {path:'login', component: LoginComponent},
    {path:'home', component:  HomeComponent}
  
];
