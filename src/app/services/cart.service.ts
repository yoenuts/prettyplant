import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, BehaviorSubject, tap,  filter } from 'rxjs';
import { LoginService } from './authentication/login.service';
import { TokenService } from './authentication/token.service';
import { Cart } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  userID!: number;

  private _cartItems = new BehaviorSubject<any[]>([]);

  cartItemsLoaded$ = this._cartItems.asObservable().pipe
  (filter(product => product.length > 0));

  cartItems$ = this._cartItems.asObservable();

  constructor(private http: HttpClient, private loginService: LoginService, private tokenService: TokenService) { 
    this.loginService.loadValues$.subscribe(userID => {
      if (userID) {
        this.userID = userID;
        forkJoin({
          getCartItems: this.getAllItems(),
        }).subscribe(({ getCartItems}) => {
          this._cartItems.next(getCartItems);

        });
      }
    });
  }

  getAllItems() {
    const url = 'http://localhost/easyplant/api-prettyplant/main/getCart';
    return this.http.get<any[]>(url).pipe(
      tap(response => console.log(response
      ))
    );
    
  }

  getAllItemsState() {
    return this._cartItems.getValue()
  }

}
