import React, { useState } from 'react';
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Products data
const products = [
  { id: 1, name: 'Product 1', price: 10 },
  { id: 2, name: 'Product 2', price: 20 },
  { id: 3, name: 'Product 3', price: 30 },
];

// Actions
const addToCart = (product) => ({ type: 'ADD_TO_CART', payload: product });
const removeFromCart = (id) => ({ type: 'REMOVE_FROM_CART', payload: id });
const increaseQuantity = (id) => ({ type: 'INCREASE_QUANTITY', payload: id });
const decreaseQuantity = (id) => ({ type: 'DECREASE_QUANTITY', payload: id });
const addToWishlist = (product) => ({ type: 'ADD_TO_WISHLIST', payload: product });
const removeFromWishlist = (id) => ({ type: 'REMOVE_FROM_WISHLIST', payload: id });
const applyCoupon = (code) => ({ type: 'APPLY_COUPON', payload: code });

// Reducer
const initialState = { cart: [], wishlist: [], discount: 0 };
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(item => item.id === action.payload.id);
      if (existing) {
        return { ...state, cart: state.cart.map(item => item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item) };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };
    case 'INCREASE_QUANTITY':
      return { ...state, cart: state.cart.map(item => item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item) };
    case 'DECREASE_QUANTITY':
      return { ...state, cart: state.cart.map(item => item.id === action.payload && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item) };
    case 'ADD_TO_WISHLIST': {
      const existing = state.wishlist.find(item => item.id === action.payload.id);
      if (!existing) {
        return { ...state, wishlist: [...state.wishlist, action.payload] };
      }
      return state;
    }
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(item => item.id !== action.payload) };
    case 'APPLY_COUPON':
      const discounts = { 'DIS10': 0.1, 'DIS20': 0.2 };
      return { ...state, discount: discounts[action.payload] || 0 };
    default:
      return state;
  }
};

// Store
const store = createStore(reducer);

// Product List Component
const ProductList = () => {
  const dispatch = useDispatch();
  return (
    <div>
      <h2>Products</h2>
      {products.map(product => (
        <div key={product.id}>
          {product.name} - ${product.price}
          <button onClick={() => dispatch(addToCart(product))}>Add to Cart</button>
          <button onClick={() => dispatch(addToWishlist(product))}>Add to Wishlist</button>
        </div>
      ))}
    </div>
  );
};

// Cart Component
const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const discount = useSelector(state => state.discount);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotal = total * (1 - discount);
  const [coupon, setCoupon] = useState('');
  return (
    <div>
      <h2>Cart</h2>
      {cart.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price} x {item.quantity}
          <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
          <button onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>
          <button onClick={() => dispatch(removeFromCart(item.id))}>Remove</button>
        </div>
      ))}
      <div>Total: ${total.toFixed(2)}</div>
      <div>Discount: {discount * 100}%</div>
      <div>Final: ${discountedTotal.toFixed(2)}</div>
      <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" />
      <button onClick={() => dispatch(applyCoupon(coupon))}>Apply</button>
    </div>
  );
};

// Wishlist Component
const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector(state => state.wishlist);
  return (
    <div>
      <h2>Wishlist</h2>
      {wishlist.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price}
          <button onClick={() => dispatch(addToCart(item))}>Add to Cart</button>
          <button onClick={() => dispatch(removeFromWishlist(item.id))}>Remove</button>
        </div>
      ))}
    </div>
  );
};

// App Component
const App = () => (
  <Provider store={store}>
    <div>
      <ProductList />
      <Cart />
      <Wishlist />
    </div>
  </Provider>
);

export default App;
