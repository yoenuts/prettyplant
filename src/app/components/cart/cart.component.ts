import { Component, OnInit } from '@angular/core';
import { Cart } from '../../interfaces';
import { CartService } from '../../services/cart.service';
import { PlantStoreService } from '../../services/plant-store.service';
import { DataService } from '../../services/data.service';
import { take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent implements OnInit {
  cartItems: any[] = [];
  itemColor: string = 'White';
  itemSubtotal: number = 0; 
  itemsTotal: number = 0;
  user: any;
  discountCode: string = '';  
  discountError: string = '';
  discountApplied: boolean = false;


  constructor(private snackBar: MatSnackBar, private cartService: CartService, private plantService: PlantStoreService, private dataService: DataService) {

  }

  updateItem(id: number): void {
    this.plantService.plantsVariationsLoaded$.pipe(take(1)).subscribe(() => {
        let found = false;
        this.cartItems.forEach(item => {
            if (item.variation_id === id && item.variation_id !== null) {
              
                this.itemColor = this.plantService.getVariationById(id);
                console.log("this is the color", this.itemColor);
                found = true;
            }
        });
    });
  }

  getImageSrc(id: number, variation: number): string {

    this.updateItem(variation);
    let imageSrc = `http://localhost/easyplant/api-prettyplant/images/${id}-${this.itemColor}.png`;
    console.log("this is the image source", imageSrc);
    return imageSrc;
  }

  getCartSubTotal() {
    this.itemSubtotal = this.cartService.getSubTotal();
    this.itemsTotal = this.itemSubtotal + 70;  
  }

  discountTotal(discountCode: string) {
    switch(discountCode) {
      case 'dev50':
        this.itemSubtotal = this.itemSubtotal * 0.5;
        this.discountApplied = true;
        break;
      case 'dev20':
        this.itemSubtotal = this.itemSubtotal * 0.2;
        this.discountApplied = true;
      this.discountError = '';
        break;
      default:
        this.discountError = 'Invalid discount code';
    }
    this.itemsTotal = this.itemSubtotal + 70;

  }

  removeDiscount() {
    this.discountApplied = false;
    this.discountCode = '';
    this.discountError = '';
    this.getCartSubTotal();
  }


  proceedToCheckout() {
    this.cartService.clearCart();
    this.snackBar.open('Thank you for shopping with us!', 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
    
    this.dataService.delete('deleteCart').subscribe(response => {
      console.log(response);
    });
    console.log("")
  }

  increaseQuantity(cart: number, id: number, variation: number | null) {
    let newQuantity = this.cartService.increaseQuantity(id, variation);

    this.dataService.patchData({quantity: newQuantity, cart_ID: cart}, 'addQuantity').subscribe(response => {
      console.log(response);
    })
  }

  decreaseQuantity(cart: number, id: number, variation: number | null) {

    let newQuantity = this.cartService.decreaseQuantity(id, variation);

    if (newQuantity === 0) {
      this.cartService.removeItemFromCart(cart);
      let id = cart;
      this.dataService.deleteData('deleteCart', id).subscribe(response => {
          console.log(response);
      });
    } else {

      this.dataService.patchData({quantity: newQuantity, cart_ID: cart}, 'addQuantity').subscribe(response => {
        console.log(response);
      })

    }


  }

  removeItem(cartID: number) {
    this.cartService.removeItemFromCart(cartID);
    this.dataService.deleteData('deleteCart', cartID).subscribe(response => {
      console.log(response);
    });

  }
  
  ngOnInit(): void {


    this.cartService.cartItemsLoaded$.subscribe(() => {
      this.getCartSubTotal();
      this.cartService.cartItems$.subscribe(cart => {
        this.cartItems = cart;
        console.log("these are the cart items brithagga", this.cartItems);

      });
    });

    this.dataService.fetchData('getUser').subscribe((response: any) => {
      console.log(response);
      this.user = response;
    });
  }
}
