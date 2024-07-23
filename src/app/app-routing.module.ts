import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ShopCategoryComponent } from './components/shop-category/shop-category.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';

const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'shop', component: ShopComponent},
  {path: 'shop/:id', component: ProductViewComponent},
  {path: 'category/:category', component: ShopCategoryComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
