import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewexpireService } from '../viewexpire.service';
import { ReactiveFormsModule } from '@angular/forms'; 
import { Router, ActivatedRoute } from '@angular/router'; // Import Router
import  {ProductEntry}  from '../product-model'

@Component({
  selector: 'app-addproducts',
  standalone: true,
  imports: [ReactiveFormsModule ],
  templateUrl: './addproducts.component.html',
  styleUrl: './addproducts.component.css'
})
export class AddproductsComponent {
  productForm: FormGroup;
  productId!: string;
  isEditing!: boolean; // Flag to indicate whether we are editing an existing product

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
      packedDate: ['',Validators.required],
      expdate: ['',Validators.required]
      
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') as string;
    this.isEditing = !!this.productId; // Check if we have a product ID (editing) or not (adding)
    if (this.isEditing) {
      this.productService.getProductById(this.productId).subscribe((product: ProductEntry) => {
        this.productForm.patchValue(product);
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const productData = this.productForm.value;
      if (this.isEditing) {
        this.productService.updateProduct(this.productId, productData).subscribe({
          next: updatedProduct => {
            console.log('Product updated successfully:', updatedProduct);
            this.router.navigateByUrl('/view;type=all'); // Redirect after update
          },
          error: error => {
            console.error('Error updating product:', error);
          }
        });
      } else {
        this.productService.addProduct(productData).subscribe({
          next: createdProduct => {
            console.log('Product added successfully:', createdProduct);
            this.router.navigateByUrl('/view;type=all'); // Redirect after add
          },
          error: error => {
            console.error('Error adding product:', error);
          }
        });
      }
    }
  }

}
