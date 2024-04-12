import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewexpireService } from '../viewexpire.service';
import { ProductEntry } from '../product-model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ RouterModule,CommonModule,  NgbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isCollapsed = true;
  constructor(private productService: ViewexpireService) { }
  expiredProducts: ProductEntry[] = [];

  expiredProductsByType: { [key: string]: ProductEntry[] } = {};
  nonExpiredProductsByType: { [key: string]: ProductEntry[] } = {};
  ngOnInit(): void {
    this.getProductData();
  }

  getProductData() {
    this.productService.getProductEntries().subscribe(products => {
      // Filter expired products
      this.expiredProducts = products.filter(product => new Date(product.expdate) < new Date());

      // this.expiredProducts = products.filter(product => new Date(product.expdate) > new Date());
      // Perform notification logic here
    
    });
  }

}
