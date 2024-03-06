import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewexpireService } from '../viewexpire.service';
import { ProductEntry } from '../product-model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit, OnDestroy {
  productEntries?: ProductEntry[];
  types?: string; // Store the currently selected product type
  subscription: Subscription | undefined;
  productForm?: FormGroup;
  constructor(
    private productEntryService: ViewexpireService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProductEntries();
    this.handleRouteChanges(); // Subscribe to route changes
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe(); // Unsubscribe to avoid memory leaks
  }

  getProductEntries(): void {
    this.productEntryService.getProductEntries()
      .subscribe(entries => {
        this.productEntries = entries;
        // Handle type filtering after getting data
      });
  }

  handleRouteChanges(): void {
    this.subscription = this.route.paramMap.pipe(
      filter(params => params.has('type')), // Filter only when 'type' parameter exists
      switchMap(params => {
        const type = params.get('type') || ''; // Get the type parameter
        this.types = type;
        return this.productEntryService.getProductEntries(); // Fetch product entries again
      })
    ).subscribe(entries => {
      this.productEntries = entries;
      this.filterProductsByType(this.types || ''); // Filter entries based on the stored type
    });
  }

  filterProductsByType(type: string): void {
    if (type === 'all') {
      this.productEntryService.getProductEntries().subscribe(entries => {
        this.productEntries = entries;
      });
    } else {
      if (!this.productEntries) return;
      this.productEntries = this.productEntries.filter(entry => entry.types === type);
    }
  }

  // deleteProduct(id: string): void {
  //   this.productEntryService.deleteProduct(id).subscribe({
  //     next: () => this.getProductEntries()
  //   });
  // } 

  deleteProduct(id: string): void {
    // Display confirmation dialog
    if (confirm('Are you sure you want to delete this product?')) {
        // User confirmed deletion
        this.productEntryService.deleteProduct(id).subscribe({
            next: () => {
                // Notify user after deletion
                alert('Product deleted successfully.');
                // Refresh product entries
                this.getProductEntries();
            },
            error: (error) => {
                // Handle error if deletion fails
                console.error('Error deleting product:', error);
                alert('Failed to delete product. Please try again later.');
            }
        });
    } else {
        // User canceled deletion
        console.log('Deletion canceled by user.');
        // You may add further action here if needed
    }
}


  editProduct(id: string): void {
    // Navigate to the edit page with the product ID as a route parameter
    this.router.navigate(['/edit', id]);
  }

  getProductDetails(id: string): void {
    this.productEntryService.getProductById(id).subscribe(product => {
      // Populate form fields with the retrieved product details
      this.productForm?.patchValue({
        types: product.types,
        productname: product.productname,
        packedDate: product.packedDate,
        expdate: product.expdate
      });
    });
  }



  calculateTimeLeft(packedDate: Date, expDate: Date): string {
    // Ensure valid Date objects
    packedDate = new Date(packedDate);
    expDate = new Date(expDate);
    
  
    // Calculate time difference in milliseconds
    const timeDifference = expDate.getTime() - packedDate.getTime();
    // Handle negative time difference (expired)
    // if (timeDifference < 0) {
    //  alert('sss')
    // }
  
    
    // Calculate days and hours, rounding hours
    const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.round((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
    // Return formatted string
    return `${daysLeft} day${daysLeft > 1 ? 's' : ''} & ${hoursLeft} hour${hoursLeft > 1 ? 's' : ''} left`;
  }
}
