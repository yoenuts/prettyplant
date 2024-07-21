import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/authentication/login.service';
import { AuthService } from '../../services/authentication/auth.service';
import { TokenService } from '../../services/authentication/token.service';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

declare var google:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  hide = true;
  password: any;
  router: any;
  errorMessage: string = '';
  isLoading = false;
  form: FormGroup;
  private subscriptions = new Subscription();
  isSignInActive: boolean = true;
  googleLogin: boolean = false;
  isShow: boolean = false;

  constructor(private _snackBar: MatSnackBar, private loginService: LoginService, private authService: AuthService, private tokenService: TokenService, private titleService: Title, private formBuilder: FormBuilder, private routers: Router, private dataService: DataService) {
    this.tokenService.flushToken();
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      username: new FormControl('')
    });
  }

  setSignInActive(isActive: boolean): void {
    this.isSignInActive = isActive;
  }

  ngOnInit(): void {
    google.accounts.id.initialize({
      client_id: '29716397471-un6fte4sip9vegqjvtk0j990pjifneht.apps.googleusercontent.com',
      callback: (response: any) => {
        //decode the credential
        let decodedToken = this.tokenService.decode(response.credential);
        let userEmail = this.tokenService.userGoogleEmailToken(decodedToken);
        let userName = this.tokenService.userGoogleNameToken(decodedToken);
        //take the email and set it to the form
        this.form.get('email')!.setValue(userEmail);
        this.form.get('username')!.setValue(userName);
        this.form.get('password')!.setValue(userName);
        this.googleLogin = true;
        
        this.onLogin();

      }
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'outline',
      size: 'large',
      text: 'Continue with Google',
      shape: 'rectangular',
      width: '500',
      height: '100',
    });

    this.titleService.setTitle('PrettyPlant - Everything In One Place');
    const usernameSubscription = this.form.get('username')!.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    const passwordSubscription = this.form.get('password')!.valueChanges.subscribe(() => {
      this.errorMessage = '';
    });
    this.subscriptions.add(usernameSubscription);
    this.subscriptions.add(passwordSubscription);
  }


  toggleForm() {
    this.isSignInActive = !this.isSignInActive;
  }



  toggleVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hide = !this.hide;
  }

  setTokenInCookie(token: string) {
    this.tokenService.setToken(token);
    console.log("setting token in cookie ", token);
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000));
    document.cookie = `token=${token}; ${expireDate}; path=/`
  }

  navigateBasedOnRole() {
    console.log("navigate to user page");
    this.routers.navigate(['/shop']);
  }

  navigateToLandPage() {
    this.routers.navigate(['/']);
  }

  onLogin() {
    console.log("yeet");
    this.isLoading = true;
    let endpoint = 'registerUser';
    if(this.isSignInActive) {
      endpoint = 'login';
    } 

    if(this.googleLogin) {
      endpoint = 'google-login';
    }
    if(endpoint == 'registerUser'){
      this._snackBar.open("Account has been successfully registered.", 'Undo', {duration: 1500});
    }
    
    this.dataService.login(this.form, endpoint).subscribe({
      next: (next:any) => {
        if(next.code === 200){
          this.setTokenInCookie(next.token);
          this.loginService.LoggedIn();
          this.routers.navigate(['/shop']);
        } else {
          if(next.message === "User already exists") {

            this.errorMessage = "User already exists. Please login.";
          } else if (next.message === "User not found") {

            this.errorMessage = "User not found. Please register.";
          } else {
            this.errorMessage = next.message;
          }
        }
      },

    })

    this.googleLogin = false;

    console.log("this was the endpoint", endpoint);
    this.isLoading = false;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
