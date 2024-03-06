import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductEntry } from './product-model';

@Injectable({
  providedIn: 'root'
})
export class ViewexpireService {

  private apiUrl = 'https://back-end-2-14a9.onrender.com/product'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

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
