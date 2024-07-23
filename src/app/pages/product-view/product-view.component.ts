import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlantStoreService } from '../../services/plant-store.service';
import { Location } from '@angular/common';

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

  constructor(private route: ActivatedRoute, private plantStore: PlantStoreService, private location: Location) { }

  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.plant_id = Number(id);
  
      this.plantDetails = this.plantStore.getPlantFromShop(this.plant_id);
      this.variations.push(this.plantDetails.plant_image);
      if(this.plantDetails.varies === 1) {
        const plantVariations = this.plantStore.getPlantVariations(this.plant_id);
        this.variations.push(...plantVariations);
      }

      console.log("Variations: ", this.variations);
    });


  }


}

