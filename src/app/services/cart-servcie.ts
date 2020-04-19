import { Injectable, RootRenderer } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    cartItems: CartItem[] = [];
    // the event will be sent to all of subscribers .. like multicast ..
    //The subject next method is used to send messages to an observable 
    //which are then sent to all angular components that are subscribers
    totalPrice: Subject<number> = new Subject<number>();
    totalQuantity: Subject<number> = new Subject<number>();


    addToCart(theCartItem: CartItem) {
        // check if we already have item in our cart ..
        let alreadyExistsOnCart: boolean = false;
        let extistingCartItem: CartItem = undefined;

        if (this.cartItems.length > 0) {
            // find the cart based on the item id ..
            // return first element that passes else return undefined ..
            extistingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)

            // check if we found it 
            alreadyExistsOnCart = (extistingCartItem != undefined);
        }
        if (alreadyExistsOnCart) {
            //increment the quantity .. 
            extistingCartItem.quantity++
        } else {
            this.cartItems.push(theCartItem);
        }
        // compute the cart total price and total quantity .. 
        this.computeCartTotals();

    }
    computeCartTotals() {
        let totalPriceValue: number = 0;
        let totalQuantityValue: number = 0;
        for (let currentCartItem of this.cartItems) {
            totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
            totalQuantityValue += currentCartItem.quantity;
        }
        // publish the new values ..  all the new subcribers will recieve the new data ..
        // one event for totalPrice .. one event for totalQuantity will be sent for all subscribers ..
        // next() --> will public/send event ..
        this.totalPrice.next(totalPriceValue);
        this.totalQuantity.next(totalQuantityValue);
    }
    decrementQuantity(cartItem: CartItem) {
        cartItem.quantity--;
        if (cartItem.quantity === 0) {
            this.removeItem(cartItem);
        } else {
            this.computeCartTotals();
        }
    }
    removeItem(cartItem) {

        let itemIndex = this.cartItems.findIndex(currentIntex => currentIntex == cartItem);
        if (itemIndex > -1) {
            this.cartItems.splice(itemIndex, 1);
        }
        this.computeCartTotals();
    }
}