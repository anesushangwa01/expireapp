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

 
  productTypes: { type: string, added: number, aboutToExpire: number, expired: number }[] = [];

  constructor(private productEntryService: ViewexpireService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.getProductStats();


    this.route.queryParams.subscribe(params => {
      if (params && params['message']) {
        this.message = JSON.parse(params['message']);
      } else {
        this.message = null; // Reset message if no message parameter is found
      }
    });
    
    
  }

  getProductStats(): void {
    this.productEntryService.getProductEntries().subscribe(entries => {
      this.productTypes = this.getProductsByType(entries);
    });
  }

  getProductsByType(entries: ProductEntry[]): { type: string, added: number, aboutToExpire: number, expired: number }[] {
    const productTypesMap = new Map<string, { added: number, aboutToExpire: number, expired: number }>();

    entries.forEach(entry => {
      const type = entry.types;
      if (!productTypesMap.has(type)) {
        productTypesMap.set(type, { added: 0, aboutToExpire: 0, expired: 0 });
      }

      const typeStats = productTypesMap.get(type)!;
      typeStats.added++;
      // if (this.isExpiredProduct(entry)) {
      //   typeStats.expired++;
      // } else 
      if (this.isProductAboutToExpire(entry)) {
        typeStats.aboutToExpire++;
      }
    });

    return Array.from(productTypesMap).map(([type, stats]) => ({ type, ...stats }));
  }

  // isExpiredProduct(entry: ProductEntry): boolean {
  //   const currentDate = new Date();
  //   return new Date(entry.expdate) < currentDate;
  // }

  isProductAboutToExpire(entry: ProductEntry): boolean {
    const currentDate = new Date();
    const sevenDaysAhead = new Date();
    sevenDaysAhead.setDate(sevenDaysAhead.getDate() + 7);
    return new Date(entry.expdate) < sevenDaysAhead && new Date(entry.expdate) > currentDate;
  }

}
