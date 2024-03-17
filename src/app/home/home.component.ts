import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewexpireService } from '../viewexpire.service';
import { ProductEntry } from '../product-model';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgbProgressbarModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  totalProducts: number = 0;
  newProducts: number = 0;
  expiredProducts: number = 0;
  productsAboutToExpire: number = 0;

  constructor(private productEntryService: ViewexpireService) {}

  ngOnInit(): void {
    this.getProductStats();
  }

  getProductStats(): void {
    this.productEntryService.getProductEntries().subscribe(entries => {
      this.totalProducts = entries.length;
      this.newProducts = entries.filter(entry => this.isNewProduct(entry)).length;
      this.expiredProducts = entries.filter(entry => this.isExpiredProduct(entry)).length;
      this.productsAboutToExpire = entries.filter(entry => this.isProductAboutToExpire(entry)).length;
    });
  }

  isNewProduct(entry: ProductEntry): boolean {
    // You can define your own criteria for what constitutes a new product
    // For example, if it's added within the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return new Date(entry.packedDate) > sevenDaysAgo;
  }

  isExpiredProduct(entry: ProductEntry): boolean {
    const currentDate = new Date();
    return new Date(entry.expdate) < currentDate;
  }

  isProductAboutToExpire(entry: ProductEntry): boolean {
    const currentDate = new Date();
    // You can define your own criteria for what constitutes a product about to expire
    // For example, if it's expiring within the next 7 days
    const sevenDaysAhead = new Date();
    sevenDaysAhead.setDate(sevenDaysAhead.getDate() + 7);
    return new Date(entry.expdate) < sevenDaysAhead && new Date(entry.expdate) > currentDate;
  }

}
