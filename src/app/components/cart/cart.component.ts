import { Component, OnInit } from '@angular/core';
import { Cart } from '../../interfaces';
import { CartService } from '../../services/cart.service';
import { PlantStoreService } from '../../services/plant-store.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})

export class CartComponent implements OnInit {
  cartItems: any[] = [];
  itemColor: string = '';
  itemSubtotal: number = 0; 

  constructor(private cartService: CartService, private plantService: PlantStoreService) {

  }

  updateItem(id: number): void {
    this.plantService.plantsVariationsLoaded$.subscribe(() => {
      let found = false;
      this.cartItems.forEach(item => {
        if (item.variation_id === id) {
          this.itemColor = this.plantService.getVariationById(id);
          found = true;
        }
      });
      if (!found) {
        this.itemColor = 'White';
      }
    });
  }

  getImageSrc(id: number, variation: number): string {
    //console.log("variation", variation);
    this.updateItem(variation);
    let imageSrc = `http://localhost/easyplant/api-prettyplant/images/${id}-${this.itemColor}.png`;
    return imageSrc ;
  }

  getCartSubTotal() {
    this.cartItems = this.cartService.getAllItemsState();
    let subTotal = 0;
    this.cartItems.forEach(item => {
      subTotal += item.plant_price * item.quantity;
    });

    this.itemSubtotal = subTotal;
  }


  proceedToCheckout() {
    //console.log("proceed to checkout");
  }
  
  ngOnInit(): void {
    
    this.cartService.cartItemsLoaded$.subscribe(() => {
      this.cartService.cartItems$.subscribe(cart => {
        this.cartItems = cart;
      });
      this.getCartSubTotal();
    });
  }
}
