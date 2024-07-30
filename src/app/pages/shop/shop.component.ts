import { Component, OnInit } from '@angular/core';
import { PlantStoreService } from '../../services/plant-store.service';
import { Product } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent implements OnInit {

  plants: Product[] = [];
  unfilteredPlants: Product[] = [];

  constructor(private route: ActivatedRoute, private productService: PlantStoreService, private router: Router) { }


  ngOnInit(): void {
    this.productService.productsLoaded$.subscribe(() => {
      this.productService.plants$.subscribe(plant => {
        this.unfilteredPlants = plant;
        this.plants = plant;
        this.filterPlantsByCategory();
      });

      if (this.productService.getAllShopPlantsState().length === 0) {
        this.productService.getAllShopPlants().subscribe((products) => {
          this.unfilteredPlants = products;
          this.plants = products;
          this.filterPlantsByCategory();
        });
      }
    });

    this.route.params.subscribe(params => {
      this.filterPlantsByCategory();
    });
  }

  private filterPlantsByCategory(): void {
    const category = this.route.snapshot.paramMap.get('category');
    if (category) {
      this.plants = this.unfilteredPlants.filter(plant => plant.plant_category === category);
    }
  }
  
}
