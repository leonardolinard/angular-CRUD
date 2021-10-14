import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Product } from './product';
import { tap, delay } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly url = 'http://localhost:3000';

  private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);

  private loaded: boolean = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Product[]> {
    if (!this.loaded) {
      this.http.get<Product[]>(this.url)
        .pipe(
          tap((products) => console.log(products)),
          delay(1000)
        )
        .subscribe(this.productsSubject$);
      this.loaded = true
    }
    return this.productsSubject$.asObservable();
  }

  add(p: Product): Observable<Product> {
    return this.http.post<Product>(this.url, p)
      .pipe(
        tap((product: Product) => this.productsSubject$.getValue().push(product))
      )
  }

  del(product: Product): Observable<any> {
    return this.http.delete(`${this.url}/${product._id}`)
      .pipe(
        tap(() => {
          let products = this.productsSubject$.getValue();
          let i = products.findIndex(p => p._id === product._id);
          if (i >= 0) {
            products.splice(i, 1)
          }
        })
      )
  }


  update(product: Product): Observable<Product> {
    return this.http.patch<Product>(`${this.url}/${product._id}`, product)
      .pipe(
        tap((p) => {
          let products = this.productsSubject$.getValue();
          let i = products.findIndex(p => p._id === product._id);
          if (i >= 0) {
            products[i].name = p.name;
          }
        })
      )
  }

}