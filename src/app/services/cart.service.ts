import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, BehaviorSubject, tap,  filter } from 'rxjs';
import { LoginService } from './authentication/login.service';
import { TokenService } from './authentication/token.service';
import { Cart } from '../interfaces';
import { Product } from '../interfaces';

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

  addToCart(cart: number, plant: Product, variation: number | null, quantity: number) {
    let oldState = this._cartItems.getValue();
    let itemIndex = oldState.findIndex(item => item.plant_ID === plant && item.variation_ID === variation);
    
    if (itemIndex !== -1) {
      oldState[itemIndex].quantity += quantity;
      //("this is the new quantity ", oldState[itemIndex].quantity)
    }
    else {
      //puwede sana na Product to kaso di ko naisip need ko pa irefactor ulet yung ibang parts
      let newCartItem: Cart = {
        cart_ID: cart,
        user_ID: this.userID,
        plant_ID: plant.plant_ID,
        plant_name: plant.plant_name,
        plant_description: plant.plant_description,
        plant_price: plant.plant_price,
        plant_rating: plant.plant_rating,
        plant_image: plant.plant_image,
        varies: plant.varies,
        plant_category: plant.plant_category,
        variation_id: variation,
        quantity: quantity
      };

      oldState.push(newCartItem);
      //("this is a new item: ", newCartItem)

      this._cartItems.next(oldState);
    }
  }

  clearCart() {
    this._cartItems.next([]);
  }

  clearItem(cart: number) {
    let oldState = this._cartItems.getValue();
    let newState = oldState.filter(item => item.cart_ID !== cart);
    this._cartItems.next(newState);
  }

  getSubTotal(): number { 
    let currentState = this._cartItems.getValue();
    let subTotal = 0;
    currentState.forEach(item => {
      subTotal += item.plant_price * item.quantity;
    });

    return subTotal;
  }


  getAllItems() {
    const url = 'http://localhost/easyplant/api-prettyplant/main/getCart';
    return this.http.get<any[]>(url);

  }

  getAllItemsState() {
    return this._cartItems.getValue()
  }

  increaseQuantity(id: number, variation: number | null): number | null {
    let oldState = this._cartItems.getValue();
    let updatedQuantity: number | null = null;
    let newState = oldState.map(item => {
        if (item.plant_ID === id && item.variation_id === variation) {
            const updatedItem = { ...item, quantity: item.quantity + 1 };
            updatedQuantity = updatedItem.quantity;
            return updatedItem;
        }
        return item;
    });
    this._cartItems.next(newState);
    return updatedQuantity;
  }

  increaseSomeMoreQuantity(id: number, newQ: number): number | null {
    let oldState = this._cartItems.getValue();
    let updatedQuantity: number | null = null;
    let newState = oldState.map(item => {
        if (item.cart_ID) {
          const updatedItem = { ...item, quantity: item.quantity + newQ };
          updatedQuantity = updatedItem.quantity;
          return updatedItem;
        }
        return item;
    });
    this._cartItems.next(newState);
    return updatedQuantity;
  }

  decreaseQuantity(id: number, variation: number | null): number | null {  
    let oldState = this._cartItems.getValue();
    let updatedQuantity: number | null = null;
    let newState = oldState.map(item => {
        if (item.plant_ID === id && item.variation_id === variation) {
          if (item.quantity === 1) {
            this.removeItemFromCart(item.cart_ID);
          }
          const updatedItem = { ...item, quantity: item.quantity - 1 };
          updatedQuantity = updatedItem.quantity;
          return updatedItem; 
        }
        return item;
    });
    this._cartItems.next(newState);
    return updatedQuantity;
  }


  getQuantity(id: number, variation: number | null): number {
    let currentState = this._cartItems.getValue();
    let item = currentState.find(item => item.plant_ID === id && item.variation_id === variation);
    return item ? item.quantity : 0;
  }


  removeItemFromCart(cart: number) {  
    let oldState = this._cartItems.getValue();
    let newState = oldState.filter(item => item.cart_ID !== cart);
    this._cartItems.next(newState);
  }

  findItemInCart(plant: number, variation: number | null) {
    let currentState = this._cartItems.getValue();
    let itemIndex = currentState.findIndex(item => item.plant_ID === plant && item.variation_id === variation);

    if (itemIndex !== -1) {
      return currentState[itemIndex].cart_ID;
    }
    else {
      return null;
    }
  }

  

}
