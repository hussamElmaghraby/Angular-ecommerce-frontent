import { Component, OnInit } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {
  productCategories: ProductCategory[];
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.getProductCategories();
  }

  getProductCategories() {
    this.productService.getProductCategoreisList().subscribe(data => {
      this.productCategories = data;
    });
  }
}
