import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart-servcie';
@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  currentCategoryId: number = 1;
  products: Product[] = [];
  searchMode: boolean = false;
  previousCategoryId: number;
  // new properties for pagenation
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyword: string;


  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(() => {
      this.getProductList();
    });
  }
  getProductList() {
    this.searchMode = this.activatedRoute.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleProductsSearch();
    } else {
      this.handleProductsList();
    }
  }
  handleProductsList() {
    // check if it has id parameter or not ..
    const hasCategoryId = this.activatedRoute.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      // get the parameter 'id' string .. convert it to number using '+'
      this.currentCategoryId = +this.activatedRoute.snapshot.paramMap.get('id');
    } else {
      // category id is not available .. default to category id = 1
      this.currentCategoryId = 1;
    }
    // if we have a different category id than the provious id reset to the page 1
    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;


    this.productService.getProductListPagenate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId
    ).subscribe(this.processResult());
  }
  handleProductsSearch() {
    const keyword: string = this.activatedRoute.snapshot.paramMap.get('keyword');
    if (this.previousKeyword != keyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = keyword;

    this.productService.getSearchProducts(this.thePageNumber - 1, this.thePageSize, keyword).subscribe(this.processResult());
  }
  // get Result mehtod ..
  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }
  updatePageSize(pageSize: number) {
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.getProductList();
  }
  addToCart(theProduct: Product) {
    const theCartItem = new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }


}
