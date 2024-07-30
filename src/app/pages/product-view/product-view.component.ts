import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlantStoreService } from '../../services/plant-store.service';
import { Location } from '@angular/common';
import { DataService } from '../../services/data.service';
import { CartService } from '../../services/cart.service';
import { Cart, Product } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent {
  plantDetails!: Product;
  plant_id!: number;
  variations: string[] = [];
  colorTitles: string[] = [];
  activeIndex = 0;
  activeColor = 'White';
  quantity: number = 1;

  isLoading = false;

  constructor(private snackbar: MatSnackBar, private route: ActivatedRoute, private plantStore: PlantStoreService, private cartService: CartService, private location: Location, private dataService: DataService) { }

  goBack() {
    this.location.back();
  }
  processUrls(urls: string[]): void {
    const regex = /-(\w+)\.png/;
    this.colorTitles = urls.map(url => {
      const match = url.match(regex);
      if (match) {
        return match[1].charAt(0).toUpperCase() + match[1].slice(1);
      } else {
        return 'White';
      }
    });
  }

  activeIndexChange(index: number, color: string): void {
    this.activeIndex = index;
    this.activeColor = color;
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
        this.quantity--;
    }
  }

  addToCart(id: number, quantity: number): void {
    this.isLoading = true;
    this.plantStore.plantsVariationsLoaded$.subscribe(() => { 
      const variation_ID = this.plantStore.findVariationID(id, this.activeColor)
      let previousQuantity = this.cartService.getQuantity(id, variation_ID);
      let newQuantity = previousQuantity + quantity;
      let cartID = this.cartService.findItemInCart(id, variation_ID);
      if(cartID) {
        this.cartService.increaseSomeMoreQuantity(id, quantity);
        this.dataService.patchData({quantity: newQuantity, cart_ID: cartID}, 'addQuantity').subscribe((response: any) => {
          console.log(response);
          this.isLoading = false;
          this.snackbar.open('Item added to cart!', 'Close', {
            duration: 2000,
          });

        })
      } else {
        this.dataService.postData({plant: id, variation: variation_ID, count: this.quantity}, 'addCart').subscribe((response: any) => {
          console.log(response);
          this.cartService.addToCart(response, id, variation_ID, this.quantity);
          this.isLoading = false;
          this.snackbar.open('Item added to cart!', 'Close', {
            duration: 2000,
          });
        })
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.plant_id = Number(id);
      this.plantStore.productsLoaded$.subscribe(() => {
        this.plantDetails = this.plantStore.getPlantFromShop(this.plant_id);
        this.variations.push(this.plantDetails.plant_image);
        if(this.plantDetails.varies === 1) {
          this.plantStore.plantsVariationsLoaded$.subscribe(()  => {
              const plantVariations = this.plantStore.getPlantVariations(this.plant_id);
              this.variations.push(...plantVariations);
              console.log("Variations: ", this.variations);
              this.processUrls(this.variations); 
            }
          )

        }

      });
  
    });

  }

}

