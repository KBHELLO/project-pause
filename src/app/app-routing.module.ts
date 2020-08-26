import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from './auth.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },


  {
    path: 'product/:sku',
    loadChildren: './product/product.module#ProductModule'
  },
  {
    path: 'category/:name',
    loadChildren: './category/category.module#CategoryModule'
  },
  {
    path: 'cart/:id',
    loadChildren: './cart/cart.module#CartModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'payment',
    loadChildren: './payment/payment.module#PaymentModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'payment/:id',
    loadChildren: './payment/payment.module#PaymentModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
