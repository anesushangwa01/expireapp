import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewexpireService } from '../viewexpire.service';
import { ProductEntry } from '../product-model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
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
  searchQuery: string = ''; // Search query property
  noProduct: boolean = false; // Flag to indicate no product to display

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
        if (entries.length === 0) {
          this.noProduct = true; // Set flag if no product entries are returned
        } else {
          this.productEntries = entries.reverse(); // Reverse the order of product entries
          // Handle type filtering after getting data
          this.filterProducts(); // Filter products initially
        }
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
      if (entries.length === 0) {
        this.noProduct = true; // Set flag if no product entries are returned
        
      } else {
        this.productEntries = entries.reverse(); // Reverse the order of product entries
        this.filterProducts(); // Filter products based on the stored type and search query
      }
    });
  }

  filterProducts(): void {
    if (!this.productEntries) return;

    let filteredEntries = this.productEntries;

    // Filter by type
    if (this.types && this.types !== 'all') {
      filteredEntries = filteredEntries.filter(entry => entry.types === this.types);
    }

    // Filter by search query (product name)
    if (this.searchQuery.trim() !== '') {
      const query = this.searchQuery.toLowerCase();
      filteredEntries = filteredEntries.filter(entry => entry.productname.toLowerCase().includes(query));
    }

    if (filteredEntries.length === 0) {
      this.noProduct = true; // Set flag if no product entries are found after filtering
    }

    this.productEntries = filteredEntries;
  }

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
  

  calculateTimeLeft(packedDate: Date, expDate: Date): string {
    // Ensure valid Date objects
    packedDate = new Date(packedDate);
    expDate = new Date(expDate);
  
    // Subtract 2 hours from the expiry date (in milliseconds)
    const removedTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    expDate.setTime(expDate.getTime() - removedTime);
  
    // Get the current date
    const currentDate = new Date();
  
    // Calculate time difference in milliseconds
    const timeDifference = expDate.getTime() - currentDate.getTime();
  
    if (timeDifference <= 0) {
      return 'Product Expired';
    }
  
    // Convert milliseconds to seconds
    const secondsLeft = Math.floor(timeDifference / 1000);
  
    // Calculate remaining days, hours, minutes, and seconds
    const daysLeft = Math.floor(secondsLeft / (24 * 60 * 60));
    const hoursLeft = Math.floor((secondsLeft % (24 * 60 * 60)) / (60 * 60));
    const minutesLeft = Math.floor((secondsLeft % (60 * 60)) / 60);
    const remainingSeconds = secondsLeft % 60;
  
    // Return formatted string
    return `${daysLeft} day${daysLeft !== 1 ? 's' : ''}, ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}, ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}, and ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''} left`;
  }


}
