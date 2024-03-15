import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import {ViewexpireService} from  '../viewexpire.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  userForm: FormGroup;
  message!: string;

  constructor(private formBuilder: FormBuilder,    private productService: ViewexpireService,
    private route: ActivatedRoute,
    private router: Router){

      this.userForm = this.formBuilder.group({
    
        userName: ['', Validators.required],
       
        password: ['', Validators.required],
      
      });
    }



  onSubmit() {
    if (this.userForm.valid) {
      const registerData = this.userForm.value;
      this.productService. login(registerData).subscribe({
        next: registerCreated => {
          // console.log('register successful:', registerCreated);
          this.message = 'register successful', registerCreated;
          this.router.navigateByUrl('/view'); // Redirect after add
        },
        error: error => {
          this.message = 'Error adding user', error;
          // console.error('Error adding user:', error);
        }
      }); // You can submit the form data here
    } else {
    
      this.message = 'provide all neccesary';
    }
  }
}
