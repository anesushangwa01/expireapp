import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductEntry } from './product-model';
import {Register}  from  './register.model'
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';




@Injectable({
  providedIn: 'root'
})
export class ViewexpireService {
  // https://back-end-2-14a9.onrender.com/product
  
  private apiUrl = ' https://back-end-2-14a9.onrender.com/product'; // Replace with your actual API URL
  private apiUrl2 = ' http://localhost:5200/register';
  private apiUrl3 = ' http://localhost:5200/login';
  constructor(private http: HttpClient) {

      

  }
  register(register: Register): Observable<Register> {
    return this.http.post<Register>(`${this.apiUrl2}`, register);
  }
   
  login(login: Register):Observable<Register> {
    return this.http.post<Register>(`${this.apiUrl3}`, login);
  }

  getProductEntries(): Observable<ProductEntry[]> {
    return this.http.get<ProductEntry[]>(`${this.apiUrl}`);
  }

  addProduct(productData: ProductEntry): Observable<ProductEntry> {
    return this.http.post<ProductEntry>(`${this.apiUrl}`, productData);
  }

  getProductById(id: string): Observable<ProductEntry> {
    return this.http.get<ProductEntry>(`${this.apiUrl}/${id}`);
  }

  updateProduct(id: string, productData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }


  

}
