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
  checkboxActive: boolean = false;

  selectedPlants: Cart[] = [];






  constructor(private snackBar: MatSnackBar, private cartService: CartService, private plantService: PlantStoreService, private dataService: DataService) {

  }

  onCheckboxChanged(plant: any) {
    //(event);

    if(plant.selected) {
      console.log('checked plant: ', plant.plant_ID);
      this.selectedPlants.push(plant); 
    } else {
      console.log('unchecked plant: ', plant.plant_ID);
      this.selectedPlants = this.selectedPlants.filter(p => p.plant_ID !== plant.plant_ID);
      console.log('now selected plants: ', this.selectedPlants);
    }

    this.getCartSubTotal();
  }

  updateItem(id: number): void {
    this.plantService.plantsVariationsLoaded$.pipe(take(1)).subscribe(() => {
        let found = false;
        this.cartItems.forEach(item => {
            if (item.variation_id === id && item.variation_id !== null) {
                this.itemColor = this.plantService.getVariationById(id);
                found = true;
            }
        });
    });
  }

  getImageSrc(id: number, variation: number): string {

    this.updateItem(variation);
    let imageSrc = `http://localhost/easyplant/api-prettyplant/images/${id}-${this.itemColor}.png`;
    return imageSrc;
  }

  getCartSubTotal() {
    if(this.selectedPlants.length > 0) {
      this.itemSubtotal = 0;
      this.selectedPlants.forEach(plant => {
        this.itemSubtotal += plant.plant_price * plant.quantity;
      });
    } else {
      this.itemSubtotal = this.cartService.getSubTotal();
    }
    if(this.discountApplied) {
      this.discountTotal(this.discountCode);
    }
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
    
    this.dataService.deleteAll('deleteCart').subscribe(response => {
      //(response);
    });
  }

  increaseQuantity(cart: number, id: number, variation: number | null) {
    if (this.selectedPlants.length > 0) {
        let plantFound = false;
        this.selectedPlants = this.selectedPlants.map(plant => {
            if (plant.plant_ID === id) {
                plant.quantity += 1; 
                plantFound = true;
            }
            return plant;
        });

        if (plantFound) {
            this.getCartSubTotal();
            if(this.discountApplied) {
              this.discountTotal(this.discountCode);
            }
            return;
        }
    }

    let newQuantity = this.cartService.increaseQuantity(id, variation);
    if (this.discountApplied) {
        this.discountTotal(this.discountCode);
    }

    this.dataService.patchData({ quantity: newQuantity, cart_ID: cart }, 'addQuantity').subscribe(response => {
        //(response);
    });
  }

  decreaseQuantity(cart: number, id: number, variation: number | null) {
    if (this.selectedPlants.length > 0) {
      let plantFound = false;
      this.selectedPlants = this.selectedPlants.map(plant => {
          if (plant.plant_ID === id) {
            plant.quantity -= 1; 
            plantFound = true;
          }
          return plant;
      });

      if (plantFound) {
          this.getCartSubTotal();
          return;
      }
    }

    let newQuantity = this.cartService.decreaseQuantity(id, variation);

    if (newQuantity === 0) {
      this.cartService.removeItemFromCart(cart);
      let id = cart;
      this.dataService.deleteData('deleteCart', id).subscribe(response => {
          //(response);
      });
    } else {

      this.dataService.patchData({quantity: newQuantity, cart_ID: cart}, 'addQuantity').subscribe(response => {
        //(response);
      })

    }
  }

  removeItem(cartID: number) {
    //if the item is selected, remove it from the selected plants array
    if(this.selectedPlants.length > 0) {
      this.selectedPlants = this.selectedPlants.filter(plant => plant.cart_ID !== cartID);
      this.getCartSubTotal();
    }
    this.cartService.removeItemFromCart(cartID);
    this.dataService.deleteData('deleteCart', cartID).subscribe(response => {
      //(response);
    });

  }
  
  ngOnInit(): void {


    this.cartService.cartItemsLoaded$.subscribe(() => {
      this.getCartSubTotal();
      this.cartService.cartItems$.subscribe(cart => {
        this.cartItems = cart;

      });
    });

    this.dataService.fetchData('getUser').subscribe((response: any) => {
      //(response);
      this.user = response;
    });
  }
}
