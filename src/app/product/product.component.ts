import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productName: string = '';

  products: Product[] = [];

  productEdit: Product = null;

  private unsubscribe$: Subject<any> = new Subject();

  constructor(private productService: ProductService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.productService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((products) => this.products = products)
  }

  save() {
    if (this.productEdit) {
      this.productService.update(
        { name: this.productName, _id: this.productEdit._id }
      ).subscribe(
        (product) => {
          this.notify('UPDATED')
        },
        (err) => {
          this.notify('ERROR');
          console.error(err)
        }
      )
    }
    else {
      this.productService.add({ name: this.productName })
        .subscribe(
          (product) => {
            console.log(product);
            this.notify('INSERTED!');
          },
          (err) => {
            console.error(err);
          }
        )
    }
    this.clearFields();
  }

  edit(product: Product) {
    this.productName = product.name;
    this.productEdit = product;
  }

  delete(product: Product) {
    this.productService.del(product)
      .subscribe(
        () => this.notify('REMOVED!'),
        (err) => this.notify(err.error.msg)
      )
  }

  clearFields() {
    this.productName = '';
    this.productEdit = null;
  }

  cancel() {
    this.clearFields();
  }

  notify(msg: string) {
    this.snackbar.open(msg, "OK", { duration: 3000 })
  }

  ngOnDestroy() {
    this.unsubscribe$.next()
  }

}