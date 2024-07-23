import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(private router: Router) { }

  onLogin() {
    // navigate to login page
    console.log("navigate to login page")
    return this.router.navigate(['/login']);
  
  }
}
