import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewexpireService } from '../viewexpire.service';
import { ProductEntry } from '../product-model';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgbProgressbarModule,CommonModule ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  message: { type: string, content: string } | null = null;

  expiredProducts: ProductEntry[] = [];

  expiredProductsByType: { [key: string]: ProductEntry[] } = {};
  nonExpiredProductsByType: { [key: string]: ProductEntry[] } = {};

  constructor(private productEntryService: ViewexpireService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getProductData();


    this.route.queryParams.subscribe(params => {
      if (params && params['message']) {
        this.message = JSON.parse(params['message']);
      } else {
        this.message = null; // Reset message if no message parameter is found
      }
    });
    
    
  }

  getProductData() {
    this.productEntryService.getProductEntries().subscribe(products => {
      // Filter expired products
      this.expiredProducts = products.filter(product => new Date(product.expdate) < new Date());

      // this.expiredProducts = products.filter(product => new Date(product.expdate) > new Date());
      // Perform notification logic here
    
    });
  }

}
