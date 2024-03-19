import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewexpireService } from '../viewexpire.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { ProductEntry } from '../product-model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-addproducts',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './addproducts.component.html',
  styleUrls: ['./addproducts.component.css']
})
export class AddproductsComponent {
  productForm: FormGroup;
  productId!: string;
  isEditing!: boolean;
  message!: string;

  constructor(
    private fb: FormBuilder,
    private productService: ViewexpireService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      img: [''],
      types: ['', Validators.required],
      productname: ['', Validators.required],
      packedDate: ['', Validators.required],
      expdate: ['', Validators.required],
      // Add a field to display date and time
      dateTime: ['']
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') as string;
    this.isEditing = !!this.productId;
    if (this.isEditing) {
      this.productService.getProductById(this.productId).subscribe((product: ProductEntry) => {
        // Patch original date and time
        this.productForm.patchValue(product);
        // Set the dateTime field to the original date and time
        this.productForm.get('packedDate')?.setValue(this.formatDate(product.packedDate));
        this.productForm.get('expdate')?.setValue(this.formatDate(product.expdate));
      });
    }
  }

  formatDate(date: Date | string): string {
    if (date instanceof Date) {
      // If it's already a Date object
      const isoString = date.toISOString();
      return isoString.slice(0, 16); // Extract only the date and time part
    } else if (typeof date === 'string') {
      // If it's a string, try converting it to a Date object
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const isoString = parsedDate.toISOString();
        return isoString.slice(0, 16); // Extract only the date and time part
      }
    }
    // If the date is neither a Date object nor a valid string representation of a date, return an empty string or handle it as needed
    return '';
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;

      if (this.isEditing) {
        this.productService.updateProduct(this.productId, productData).subscribe({
          next: updatedProduct => {
            this.message = 'Product has been updated';
            this.navigateToHomeWithMessage('success', 'Product has been updated');
          },
          error: error => {
            this.message = 'Failed to update the product';
            this.navigateToHomeWithMessage('error', 'Failed to update the product');
          }
        });
      } else {
        this.productService.addProduct(productData).subscribe({
          next: createdProduct => {
            this.message = 'Product added successfully';
            this.navigateToHomeWithMessage('success', 'Product added successfully');
          },
          error: error => {
            this.message = 'check your connection and try again!';
            this.navigateToHomeWithMessage('error', 'Check your connection and try again!');
          }
        });
      }
    }
  }

  navigateToHomeWithMessage(type: string, message: string): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { message: JSON.stringify({ type: type, content: message }) }
    };
    this.router.navigate(['/home'], navigationExtras);
  }
}
