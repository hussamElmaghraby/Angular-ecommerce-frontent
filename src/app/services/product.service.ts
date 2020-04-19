import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl: string;
  private catUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:8080/restful/products';
    this.catUrl = 'http://localhost:8080/restful/product-category'

  }
  // get all products by id ..
  getProductList(categoryId: number): Observable<Product[]> {
    const productsUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(productsUrl);
  }
  // get products pages ..
  getProductListPagenate(thePage: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {
    const pagesUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}` + `&page=${thePage}&size=${pageSize}`;
    return this.http.get<GetResponseProducts>(pagesUrl);
  }
  // get products category .. 
  getProductCategoreisList(): Observable<ProductCategory[]> {

    return this.http.get<GetResponseProductCategory>(this.catUrl).pipe(map(
      response => response._embedded.productCategory));
  }
  // get products by pages .. by keyword 
  getSearchProducts(thePage: number, pageSize: number, keyword: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}` + `&page=${thePage}&size=${pageSize}`;
    return this.http.get<GetResponseProducts>(searchUrl);
  }
  // get one product by id ..
  getProductDetails(productId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${productId}`;
    return this.http.get<Product>(productUrl);
  }

  // return products method ..
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.http.get<GetResponseProducts>(searchUrl).pipe(map(response => response._embedded.products));

  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number  // current page 
  }

}
/// model interfaces ..
interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}

