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
  private _plantVariations = new BehaviorSubject<Variation[]>([]);
  userID!: number;

  products$ = this._products.asObservable();
  showLoader$ = this._showLoader.asObservable();
  plants$ = this._plants.asObservable();

  productsLoaded$ = this._products.asObservable().pipe
  (filter(product => product.length > 0));


  constructor(private http: HttpClient, private loginService: LoginService, private tokenService: TokenService) { 
    this.loginService.loadValues$.subscribe(userID => {
      if (userID) {
        this._showLoader.next(true);
        this.userID = userID;
        forkJoin({
          getPlants: this.getAllPlants(),
        }).subscribe(({ getPlants }) => {
          this._products.next(getPlants);
          this._showLoader.next(false);
        });
      }
    });
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

  getallPlantsState() {
    return this._products.getValue();
  }

  getAllShopPlantsState() {
    return this._plants.getValue();
  }
}
