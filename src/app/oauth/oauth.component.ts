import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Register } from '../register.model';
import { Router, ActivatedRoute } from '@angular/router'; 
import { ReactiveFormsModule } from '@angular/forms';
import {ViewexpireService} from '../viewexpire.service' 
@Component({
  selector: 'app-oauth',
  standalone: true,
  imports: [ CommonModule,  ReactiveFormsModule  ],
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class OAuthComponent {
  userForm: FormGroup;
  message!: string;

  constructor(private formBuilder: FormBuilder,    private productService: ViewexpireService,
    private route: ActivatedRoute,
    private router: Router) {
    
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const registerData = this.userForm.value;
      this.productService. register(registerData).subscribe({
        next: registerCreated => {
          // console.log('register successful:', registerCreated);
          this.message = 'register successful', registerCreated;
          this.router.navigateByUrl('/login'); // Redirect after add
        },
        error: error => {
          this.message = ' something went wrong ', error;
          // console.error('Error adding user:', error);
        }
      }); // You can submit the form data here
    } else {
    
      this.message = 'fill all the gaps';
    }
  }
}
