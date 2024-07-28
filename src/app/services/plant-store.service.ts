import { Injectable } from '@angular/core';
import { Product, Variation } from '../interfaces';
import { forkJoin, BehaviorSubject, tap,  filter } from 'rxjs';
import { LoginService } from './authentication/login.service';
import { TokenService } from './authentication/token.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantStoreService {


  private _products = new BehaviorSubject<Product[]>([]);
  private _plants = new BehaviorSubject<Product[]>([]);
  private _showLoader = new BehaviorSubject<boolean>(false);
  _plantVariations = new BehaviorSubject<Variation[]>([]);
  userID!: number;

  products$ = this._products.asObservable();
  showLoader$ = this._showLoader.asObservable();
  plants$ = this._plants.asObservable();

  productsLoaded$ = this._products.asObservable().pipe
  (filter(product => product.length > 0));
  plantsVariationsLoaded$ = this._plantVariations.asObservable().pipe
  (filter(product => product.length > 0));

  plantVariations$ = this._plantVariations.asObservable();

  constructor(private http: HttpClient, private loginService: LoginService, private tokenService: TokenService) { 
    this.loginService.loadValues$.subscribe(userID => {
      if (userID) {
        this._showLoader.next(true);
        this.userID = userID;
        forkJoin({
          getPlants: this.getAllPlants(),
          getAllVariations: this.getAllVariations()
        }).subscribe(({ getPlants, getAllVariations }) => {
          this._products.next(getPlants);
          this._plantVariations.next(getAllVariations);
          this._showLoader.next(false);
        });
      }
    });
  }

  getAllVariations() {
    const url = 'http://localhost/easyplant/api-prettyplant/main/getVariation';
    return this.http.get<Variation[]>(url).pipe(
      tap(response => console.log(response
      ))
    );
  }

  getVariationById(id: number): string {

    //console.log("this is the id: ", id);
    //console.log("this is the variation: ", this._plantVariations.getValue());
    const variations = this._plantVariations.getValue().find(variation => variation.variation_id === id);
    //console.log("this is the variation", variations);
    if(!variations) {
      console.log("ala")
      return '';
    }

    //console.log("this is the variation", variations);
    return variations!.pot_color;
  }

  getVariationImagePathById(id: number): string {
    const variations = this._plantVariations.getValue().find(variation => variation.variation_id === id);
    return variations!.plant_image;
  }
  
  getAllPlants() {
    console.log("i ran from plants store");
    const url = 'http://localhost/easyplant/api-prettyplant/main/getProduct';
    return this.http.get<Product[]>(url).pipe(
        tap(response => console.log(response))
    );
  }

  getAllShopPlants(): Observable<Product[]> {  
    let shopPlants = this._products.getValue();
    this._plants.next(shopPlants);

    return this.plants$;

  }

  getPlantVariations(id: number): string[] {
    const variations = this._plantVariations.getValue().filter(variation => variation.plant_ID === id);
    return variations.map(variation => variation.plant_image);
  }


  getPlantFromShop(id: number): Product {
    const plantHere = this._products.getValue().find(plant => plant.plant_ID === id);
    return plantHere!;
  }

  findVariationID(productId: number, color: string): number | null {
    console.log("these are the variations: ", this._plantVariations.getValue());
    const variation = this._plantVariations.getValue().find(v => v.plant_ID === productId && v.pot_color === color);
    return variation ? variation.variation_id : null;
  }

  getallPlantsState() {
    return this._products.getValue();
  }

  getAllShopPlantsState() {
    return this._plants.getValue();
  }
}
