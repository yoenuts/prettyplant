import { Component, OnInit } from '@angular/core';
import { PlantStoreService } from '../../services/plant-store.service';
import { Product } from '../../interfaces';

import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  plants: Product[] = [];

  constructor(private productService: PlantStoreService, private router: Router) { }


  ngOnInit(): void {
    
    this.productService.productsLoaded$.subscribe(() => {

      this.productService.plants$.subscribe(plant => {
        this.plants = plant;
      });


      if (this.productService.getAllShopPlantsState().length === 0) {
        this.productService.getAllShopPlants().subscribe((products) => {
          console.log(products);
          this.plants = products;
        });
      }
    });
  }

}
