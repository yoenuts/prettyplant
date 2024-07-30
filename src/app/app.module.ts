import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './pages/login/login.component';
import { TokenInterceptor } from './services/authentication/token.interceptor';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

//material modules here
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import { CarouselModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';

import { LandingComponent } from './pages/landing/landing.component';
import { ShopComponent } from './pages/shop/shop.component';
import { CartComponent } from './components/cart/cart.component';
import { ShopCategoryComponent } from './components/shop-category/shop-category.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductViewComponent } from './pages/product-view/product-view.component';




@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    LandingComponent,
    ShopComponent,
    CartComponent,
    ShopCategoryComponent,
    CheckoutComponent,
    ProductViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatDialogModule,
    MatListModule,
    MatMenuModule,
    CarouselModule,
    FormsModule
  ],
  providers: [
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
