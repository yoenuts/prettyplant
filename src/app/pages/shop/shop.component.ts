import { Component, OnInit } from '@angular/core';
import { PlantStoreService } from '../../services/plant-store.service';
import { Product } from '../../interfaces';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  plants: Product[] = [];

  constructor(private productService: PlantStoreService) { }

  
  ngOnInit(): void {
    this.productService.productsLoaded$.subscribe(() => {
      if (this.productService.getallPlantsState().length === 0) {
        this.productService.getAllPlants().subscribe((products) => {
          console.log(products);
          this.plants = products;
        });
      }
    });
  }

}
