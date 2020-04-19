import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from 'src/app/services/cart-servcie';
@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalQuantity: number = 0;
  totalPrice: number = 0.00;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.getCartItems();
  }

  getCartItems() {
    // handle the cart items ..
    this.cartItems = this.cartService.cartItems;
    //subscribe to the cart total quantity ..
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data)
    //subscribe to the cart total quantity ..
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);

    // total price and quantity ..
    this.cartService.computeCartTotals();
  }
  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }
  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }
  removeItem(theCartItem: CartItem) {
    this.cartService.removeItem(theCartItem);
  }

}
