import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';
import { TokenService } from '../../services/authentication/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {


  constructor(private router: Router, private dialog: MatDialog, private tokenService: TokenService) { }

  isActive(route: string): boolean {
    console.log("im active")
    return this.router.url === route;
  }

  navigateToLogin() {
    // navigate to login page
    return this.router.navigate(['/login']);
  }

  navigateToLanding() {
    return this.router.navigate(['/']);
  }

  navigateToShop() {
    return this.router.navigate(['/shop']);
  }
  
  isLandingPage() {
    return this.router.url === '/';
  }

  isLoginPage() {
    return this.router.url === '/login';
  }

  openCart() {
    this.dialog.open(CartComponent, {
      width: '40vw', // Set width to 100% of the viewport width
      maxWidth: '100vw', // Ensure it doesn't exceed the viewport width
      position: {
        right: '0px' // Position it at 0px from the right
      },
      panelClass: 'full-width-dialog' // Use a custom class for further styling if needed
    });
  }


  openAll() { 
    return this.router.navigate(['/shop']);
  }

  openProfile() {
    return this.router.navigate(['/profile']);
  }

  openSmall() {
    return this.router.navigate(['/shop/category/small']);
  }

  openMedium() {
    return this.router.navigate(['/shop/category/medium']);
  }

  openLarge() {
    return this.router.navigate(['/shop/category/large']);
  } 

  isAll() {
    return this.router.url === '/shop';
  }

  isSmall() {
    return this.router.url === '/shop/category/small';
  }

  isMedium() {
    return this.router.url === '/shop/category/medium';
  }

  isLarge() {
    return this.router.url === '/shop/category/large';
  }

  logout() {
    this.tokenService.flushToken(); 
    this.router.navigate(['/']);
  }

}
