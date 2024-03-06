import { Routes } from '@angular/router';
import {ViewComponent} from './view/view.component';
import  {HeaderComponent}  from './header/header.component'
import { AddproductsComponent } from './addproducts/addproducts.component'

export const routes: Routes = [
    { path: '', redirectTo: '/view', pathMatch: 'full' },
    { path: 'view', component: ViewComponent},
    { path: 'header', component: HeaderComponent },
    { path: 'view/:type', component: ViewComponent },
    {path: 'addproduct', component: AddproductsComponent},
    { path: 'edit/:id', component: AddproductsComponent}
];
