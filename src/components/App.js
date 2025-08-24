import React, { useReducer, createContext, useContext, useState } from 'react';

// Redux-like Action Types
const ACTION_TYPES = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  INCREASE_QUANTITY: 'INCREASE_QUANTITY',
  DECREASE_QUANTITY: 'DECREASE_QUANTITY',
  ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
  REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
  APPLY_COUPON: 'APPLY_COUPON',
  REMOVE_COUPON: 'REMOVE_COUPON'
};

// Initial State
const initialState = {
  cart: [],
  wishlist: [],
  appliedCoupon: null,
  coupons: [
    { code: 'SAVE10', discount: 0.1, minAmount: 50, description: '10% off orders $50+' },
    { code: 'WELCOME20', discount: 0.2, minAmount: 100, description: '20% off orders $100+' },
    { code: 'FLAT15', discount: 15, minAmount: 30, description: '$15 off orders $30+', isFlat: true }
  ]
};

// Sample Products
const products = [
  { id: 1, name: 'Premium Headphones', price: 299.99, image: '🎧', rating: 4.8 },
  { id: 2, name: 'Wireless Mouse', price: 49.99, image: '🖱️', rating: 4.5 },
  { id: 3, name: 'Mechanical Keyboard', price: 149.99, image: '⌨️', rating: 4.7 },
  { id: 4, name: 'USB-C Cable', price: 19.99, image: '🔌', rating: 4.3 },
  { id: 5, name: 'Phone Stand', price: 24.99, image: '📱', rating: 4.6 },
  { id: 6, name: 'Laptop Sleeve', price: 39.99, image: '💼', rating: 4.4 }
];

// CSS Styles for Bootstrap-like appearance
const styles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f8f9fa;
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
  }

  .navbar-expand-lg {
    background-color: #343a40;
    padding: 1rem 0;
    margin-bottom: 2rem;
  }

  .text-center {
    text-align: center;
    color: white;
    margin: 0;
    font-size: 2rem;
    font-weight: bold;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
  }

  .col-lg-3,
  .col-md-6,
  .col-sm-12 {
    padding: 0 15px;
    margin-bottom: 30px;
    flex: 0 0 25%;
    max-width: 25%;
  }

  @media (max-width: 992px) {
    .col-lg-3 {
      flex: 0 0 50%;
      max-width: 50%;
    }
  }

  @media (max-width: 768px) {
    .col-lg-3 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }

  .custom-card.card {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    background: white;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    transition: box-shadow 0.15s ease-in-out;
  }

  .custom-card.card:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  }

  .card-body {
    padding: 1.25rem;
    text-align: center;
  }

  .card-title {
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
    font-weight: 500;
    color: #212529;
  }

  .card-text {
    margin-bottom: 1rem;
    color: #6c757d;
  }

  .product-image {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .product-price {
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
    margin-bottom: 1rem;
  }

  .btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.375rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    cursor: pointer;
    margin: 0.25rem;
  }

  .btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }

  .btn-primary:hover {
    color: #fff;
    background-color: #0056b3;
    border-color: #0056b3;
  }

  .btn-success {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745;
  }

  .btn-success:hover {
    color: #fff;
    background-color: #218838;
    border-color: #1e7e34;
  }

  .btn-danger {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
  }

  .btn-danger:hover {
    color: #fff;
    background-color: #c82333;
    border-color: #bd2130;
  }

  .btn-outline-secondary {
    color: #6c757d;
    background-color: transparent;
    border-color: #6c757d;
  }

  .btn-outline-secondary:hover {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
  }

  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
    border-radius: 0.25rem;
  }

  .mt-4 {
    margin-top: 1.5rem;
  }

  .mb-4 {
    margin-bottom: 1.5rem;
  }

  .cart-section,
  .wishlist-section {
    background: white;
    border-radius: 0.375rem;
    padding: 2rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    margin-bottom: 2rem;
  }

  .cart-item,
  .wishlist-item {
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    padding: 1rem;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .cart-item-details {
    flex: 1;
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .quantity-display {
    min-width: 2rem;
    text-align: center;
    font-weight: bold;
  }

  .cart-summary {
    border-top: 1px solid #dee2e6;
    padding-top: 1rem;
    margin-top: 1rem;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .summary-total {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 1.125rem;
    border-top: 1px solid #dee2e6;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #6c757d;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .nav-tabs {
    display: flex;
    border-bottom: 1px solid #dee2e6;
    margin-bottom: 2rem;
  }

  .nav-link {
    padding: 0.5rem 1rem;
    border: 1px solid transparent;
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    color: #495057;
    background: none;
    cursor: pointer;
    text-decoration: none;
    margin-bottom: -1px;
  }

  .nav-link.active {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff;
  }

  .nav-link:hover {
    border-color: #e9ecef #e9ecef #dee2e6;
  }

  .coupon-section {
    background: white;
    border-radius: 0.375rem;
    padding: 2rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  }

  .form-control {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ced4da;
    border-radius: 0.375rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .form-control:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }

  .input-group {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    width: 100%;
  }

  .input-group .form-control {
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    margin-bottom: 0;
  }

  .input-group-append {
    margin-left: -1px;
  }

  .alert {
    position: relative;
    padding: 0.75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: 0.375rem;
  }

  .alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
  }

  .alert-info {
    color: #0c5460;
    background-color: #d1ecf1;
    border-color: #bee5eb;
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: inherit;
  }
`;

// Redux Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_TO_CART:
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };

    case ACTION_TYPES.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload.id)
      };

    case ACTION_TYPES.INCREASE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };

    case ACTION_TYPES.DECREASE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      };

    case ACTION_TYPES.ADD_TO_WISHLIST:
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };

    case ACTION_TYPES.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload.id)
      };

    case ACTION_TYPES.APPLY_COUPON:
      return {
        ...state,
        appliedCoupon: action.payload
      };

    case ACTION_TYPES.REMOVE_COUPON:
      return {
        ...state,
        appliedCoupon: null
      };

    default:
      return state;
  }
};

// Context for Redux-like state management
const CartContext = createContext();

// Context Provider Component
const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const actions = {
    addToCart: (product) => dispatch({ type: ACTION_TYPES.ADD_TO_CART, payload: product }),
    removeFromCart: (product) => dispatch({ type: ACTION_TYPES.REMOVE_FROM_CART, payload: product }),
    increaseQuantity: (product) => dispatch({ type: ACTION_TYPES.INCREASE_QUANTITY, payload: product }),
    decreaseQuantity: (product) => dispatch({ type: ACTION_TYPES.DECREASE_QUANTITY, payload: product }),
    addToWishlist: (product) => dispatch({ type: ACTION_TYPES.ADD_TO_WISHLIST, payload: product }),
    removeFromWishlist: (product) => dispatch({ type: ACTION_TYPES.REMOVE_FROM_WISHLIST, payload: product }),
    applyCoupon: (coupon) => dispatch({ type: ACTION_TYPES.APPLY_COUPON, payload: coupon }),
    removeCoupon: () => dispatch({ type: ACTION_TYPES.REMOVE_COUPON })
  };

  return (
    <CartContext.Provider value={{ state, ...actions }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { state, addToCart, addToWishlist, removeFromWishlist } = useCart();
  
  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const isInCart = state.cart.some(item => item.id === product.id);

  return (
    <div className="col-lg-3 col-md-6 col-sm-12">
      <div className="custom-card card">
        <div className="card-body">
          <div className="product-image">{product.image}</div>
          <h4 className="card-title">{product.name}</h4>
          <p className="card-text">⭐ {product.rating}</p>
          <div className="product-price">${product.price}</div>
          <button
            className="btn btn-primary add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
          <button
            className={`btn ${isInWishlist ? 'btn-danger' : 'btn-outline-secondary'} wishlist-btn`}
            onClick={() => isInWishlist ? removeFromWishlist(product) : addToWishlist(product)}
          >
            {isInWishlist ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Cart Component
const Cart = () => {
  const { state, removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discount = 0;
  if (state.appliedCoupon) {
    if (state.appliedCoupon.isFlat) {
      discount = state.appliedCoupon.discount;
    } else {
      discount = subtotal * state.appliedCoupon.discount;
    }
  }
  
  const total = Math.max(0, subtotal - discount);

  if (state.cart.length === 0) {
    return (
      <div className="cart-section">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-section">
      <h2>Shopping Cart ({state.cart.length})</h2>
      
      <div>
        {state.cart.map(item => (
          <div key={item.id} className="cart-item">
            <div className="product-image" style={{ fontSize: '2rem' }}>{item.image}</div>
            <div className="cart-item-details">
              <h5>{item.name}</h5>
              <p>${item.price}</p>
            </div>
            
            <div className="quantity-controls">
              <button
                className="btn btn-sm btn-outline-secondary decrease-quantity"
                onClick={() => decreaseQuantity(item)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span className="quantity-display">{item.quantity}</span>
              <button
                className="btn btn-sm btn-outline-secondary increase-quantity"
                onClick={() => increaseQuantity(item)}
              >
                +
              </button>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div><strong>${(item.price * item.quantity).toFixed(2)}</strong></div>
              <button
                className="btn btn-sm btn-danger remove-from-cart"
                onClick={() => removeFromCart(item)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {state.appliedCoupon && (
          <div className="summary-row" style={{ color: '#28a745' }}>
            <span>Discount ({state.appliedCoupon.code}):</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="summary-total">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Wishlist Component
const Wishlist = () => {
  const { state, removeFromWishlist, addToCart } = useCart();

  if (state.wishlist.length === 0) {
    return (
      <div className="wishlist-section">
        <div className="empty-state">
          <div className="empty-icon">💝</div>
          <h3>Your wishlist is empty</h3>
          <p>Save items you love for later!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-section">
      <h2>Wishlist ({state.wishlist.length})</h2>
      
      <div>
        {state.wishlist.map(item => (
          <div key={item.id} className="wishlist-item">
            <div className="product-image" style={{ fontSize: '2rem' }}>{item.image}</div>
            <div className="cart-item-details">
              <h5>{item.name}</h5>
              <p>${item.price}</p>
            </div>
            <div>
              <button
                className="btn btn-primary add-to-cart-from-wishlist"
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-danger remove-from-wishlist"
                onClick={() => removeFromWishlist(item)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Coupon Component
const CouponSection = () => {
  const { state, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleApplyCoupon = () => {
    const coupon = state.coupons.find(c => c.code === couponInput.toUpperCase());
    if (coupon && subtotal >= coupon.minAmount) {
      applyCoupon(coupon);
      setCouponInput('');
    } else if (coupon) {
      alert(`Minimum order amount of $${coupon.minAmount} required for this coupon`);
    } else {
      alert('Invalid coupon code');
    }
  };

  return (
    <div className="coupon-section">
      <h2>Discount Coupons</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control coupon-input"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          placeholder="Enter coupon code"
        />
        <div className="input-group-append">
          <button
            className="btn btn-success apply-coupon"
            onClick={handleApplyCoupon}
            disabled={!couponInput.trim() || state.cart.length === 0}
          >
            Apply
          </button>
        </div>
      </div>
      
      {state.appliedCoupon && (
        <div className="alert alert-success">
          <span>
            {state.appliedCoupon.code} applied! {state.appliedCoupon.description}
          </span>
          <button
            className="btn-close remove-coupon"
            onClick={removeCoupon}
            style={{ float: 'right' }}
          >
            ✕
          </button>
        </div>
      )}

      <div>
        <h4>Available Coupons:</h4>
        {state.coupons.map((coupon, index) => (
          <div key={index} className="alert alert-info">
            <strong>{coupon.code}</strong> - {coupon.description}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main App Component
const ShoppingCartApp = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { state } = useCart();

  return (
    <>
      <style>{styles}</style>
      <div>
        <nav className="navbar-expand-lg">
          <h1 className="text-center">Shopping Cart Redux</h1>
        </nav>

        <div className="container">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                Products ({products.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'cart' ? 'active' : ''}`}
                onClick={() => setActiveTab('cart')}
              >
                Cart ({state.cart.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'wishlist' ? 'active' : ''}`}
                onClick={() => setActiveTab('wishlist')}
              >
                Wishlist ({state.wishlist.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'coupons' ? 'active' : ''}`}
                onClick={() => setActiveTab('coupons')}
              >
                Coupons ({state.coupons.length})
              </button>
            </li>
          </ul>

          <div className="mt-4">
            {activeTab === 'products' && (
              <div className="row">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {activeTab === 'cart' && <Cart />}
            {activeTab === 'wishlist' && <Wishlist />}
            {activeTab === 'coupons' && <CouponSection />}
          </div>
        </div>
      </div>
    </>
  );
};

// Root App with Provider
const App = () => {
  return (
    <CartProvider>
      <ShoppingCartApp />
    </CartProvider>
  );
};

export default App;
