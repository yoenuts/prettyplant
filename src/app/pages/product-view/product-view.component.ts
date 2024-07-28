import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlantStoreService } from '../../services/plant-store.service';
import { Location } from '@angular/common';
import { DataService } from '../../services/data.service';

import { Product } from '../../interfaces';

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

  constructor(private route: ActivatedRoute, private plantStore: PlantStoreService, private location: Location, private dataService: DataService) { }

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

    console.log("color", color);
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
        this.quantity--;
    }
  }

  addToCart(id: number) {
    this.plantStore.plantsVariationsLoaded$.subscribe(() => { 
      const variation_ID = this.plantStore.findVariationID(id, this.activeColor)
      console.log("this is the variation id", variation_ID)
      console.log("this is the product id", id) 
      console.log("this is the quantity", this.quantity)

      this.dataService.postData({plant: id, variation: variation_ID, count: this.quantity}, 'addCart').subscribe((response: any) => {
        console.log(response);
      })
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
              this.processUrls(this.variations); 
            }
          )

          console.log("variations", this.variations);

        }

      });
  
    });

  }

}

