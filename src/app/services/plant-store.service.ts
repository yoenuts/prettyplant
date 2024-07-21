import { Injectable } from '@angular/core';
import { Product } from '../interfaces';
import { forkJoin, BehaviorSubject, tap,  filter } from 'rxjs';
import { LoginService } from './authentication/login.service';
import { TokenService } from './authentication/token.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PlantStoreService {


  private _products = new BehaviorSubject<Product[]>([]);
  private _showLoader = new BehaviorSubject<boolean>(false);
  userID!: number;

  products$ = this._products.asObservable();
  showLoader$ = this._showLoader.asObservable();

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


  getallPlantsState() {
    return this._products.getValue();
  }
}
