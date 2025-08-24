import React, { createContext, useContext, useReducer } from 'react';

// Action Types
const ADD_TO_CART = 'ADD_TO_CART';
const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
const INCREASE_QUANTITY = 'INCREASE_QUANTITY';
const DECREASE_QUANTITY = 'DECREASE_QUANTITY';
const ADD_TO_WISHLIST = 'ADD_TO_WISHLIST';
const REMOVE_FROM_WISHLIST = 'REMOVE_FROM_WISHLIST';
const APPLY_DISCOUNT = 'APPLY_DISCOUNT';
const CLEAR_DISCOUNT = 'CLEAR_DISCOUNT';

// Action Creators
const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product
});

const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId
});

const increaseQuantity = (productId) => ({
  type: INCREASE_QUANTITY,
  payload: productId
});

const decreaseQuantity = (productId) => ({
  type: DECREASE_QUANTITY,
  payload: productId
});

const addToWishlist = (product) => ({
  type: ADD_TO_WISHLIST,
  payload: product
});

const removeFromWishlist = (productId) => ({
  type: REMOVE_FROM_WISHLIST,
  payload: productId
});

const applyDiscount = (couponCode) => ({
  type: APPLY_DISCOUNT,
  payload: couponCode
});

const clearDiscount = () => ({
  type: CLEAR_DISCOUNT
});

// Initial State
const initialState = {
  cart: [],
  wishlist: [],
  discount: 0,
  appliedCoupon: null,
  coupons: {
    'SAVE10': 10,
    'SAVE20': 20,
    'WELCOME5': 5,
    'MEGA25': 25
  }
};

// Reducer Function
const shoppingReducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART: {
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
      } else {
        return {
          ...state,
          cart: [...state.cart, { ...action.payload, quantity: 1 }]
        };
      }
    }

    case REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };

    case INCREASE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      };

    case DECREASE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case ADD_TO_WISHLIST: {
      const alreadyExists = state.wishlist.find(item => item.id === action.payload.id);
      if (alreadyExists) {
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };
    }

    case REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      };

    case APPLY_DISCOUNT: {
      const couponCode = action.payload.toUpperCase();
      const discountValue = state.coupons[couponCode];
      if (discountValue) {
        return {
          ...state,
          discount: discountValue,
          appliedCoupon: couponCode
        };
      }
      return state;
    }

    case CLEAR_DISCOUNT:
      return {
        ...state,
        discount: 0,
        appliedCoupon: null
      };

    default:
      return state;
  }
};

// Create Context for State Management
const ShoppingContext = createContext();

// Provider Component
const ShoppingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(shoppingReducer, initialState);
  
  return (
    <ShoppingContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingContext.Provider>
  );
};

// Custom Hook to use Shopping Context
const useShopping = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShopping must be used within a ShoppingProvider');
  }
  return context;
};

// Sample Products Data
const sampleProducts = [
  { id: 1, name: 'Laptop', price: 999.99, image: '💻', category: 'Electronics' },
  { id: 2, name: 'Smartphone', price: 599.99, image: '📱', category: 'Electronics' },
  { id: 3, name: 'Headphones', price: 199.99, image: '🎧', category: 'Electronics' },
  { id: 4, name: 'Coffee Maker', price: 89.99, image: '☕', category: 'Appliances' },
  { id: 5, name: 'Book', price: 24.99, image: '📚', category: 'Books' },
  { id: 6, name: 'T-Shirt', price: 19.99, image: '👕', category: 'Clothing' }
];

// Product Card Component
const ProductCard = ({ product }) => {
  const { state, dispatch } = useShopping();
  const { cart, wishlist } = state;
  
  const isInCart = cart.some(item => item.id === product.id);
  const isInWishlist = wishlist.some(item => item.id === product.id);

  return (
    <div className="custom-card card">
      <div className="card-body">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{product.image}</div>
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text" style={{ fontSize: '0.875rem', color: '#666' }}>{product.category}</p>
          <p className="card-text" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#007bff' }}>${product.price}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => dispatch(addToCart(product))}
            className={`btn ${isInCart ? 'btn-success' : 'btn-primary'}`}
            style={{ flex: 1, fontSize: '0.875rem' }}
          >
            {isInCart ? '✓ In Cart' : '🛒 Add to Cart'}
          </button>
          
          <button
            onClick={() => 
              isInWishlist 
                ? dispatch(removeFromWishlist(product.id))
                : dispatch(addToWishlist(product))
            }
            className="btn btn-outline-secondary"
            style={{ fontSize: '0.875rem' }}
          >
            {isInWishlist ? '💔' : '💖'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item }) => {
  const { dispatch } = useShopping();

  return (
    <div className="card mb-3">
      <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '2rem' }}>{item.image}</div>
        <div style={{ flex: 1 }}>
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text">${item.price}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => dispatch(decreaseQuantity(item.id))}
            className="btn btn-outline-secondary btn-sm"
            style={{ width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            −
          </button>
          <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: '500' }}>{item.quantity}</span>
          <button
            onClick={() => dispatch(increaseQuantity(item.id))}
            className="btn btn-primary btn-sm"
            style={{ width: '2rem', height: '2rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            +
          </button>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>${(item.price * item.quantity).toFixed(2)}</p>
          <button
            onClick={() => dispatch(removeFromCart(item.id))}
            className="btn btn-link text-danger btn-sm"
            style={{ padding: 0, fontSize: '0.875rem' }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

// Cart Component
const Cart = () => {
  const { state } = useShopping();
  const { cart, discount, appliedCoupon } = state;
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  if (cart.length === 0) {
    return (
      <div className="card text-center">
        <div className="card-body">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <p className="card-text">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Shopping Cart ({cart.length})</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          {cart.map(item => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#28a745' }}>
              <span>Discount ({appliedCoupon}):</span>
              <span>-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 'bold', borderTop: '1px solid #dee2e6', paddingTop: '0.5rem' }}>
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wishlist Component
const Wishlist = () => {
  const { state, dispatch } = useShopping();
  const { wishlist } = state;

  if (wishlist.length === 0) {
    return (
      <div className="card text-center">
        <div className="card-body">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💖</div>
          <p className="card-text">Your wishlist is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Wishlist ({wishlist.length})</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {wishlist.map(product => (
            <div key={product.id} className="card">
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '2rem' }}>{product.image}</div>
                <div style={{ flex: 1 }}>
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text" style={{ color: '#007bff', fontWeight: 'bold' }}>${product.price}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => dispatch(addToCart(product))}
                    className="btn btn-primary btn-sm"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => dispatch(removeFromWishlist(product.id))}
                    className="btn btn-danger btn-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Coupon Component
const CouponSection = () => {
  const { state, dispatch } = useShopping();
  const { coupons, appliedCoupon, discount } = state;
  const [couponInput, setCouponInput] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleApplyCoupon = () => {
    const upperCoupon = couponInput.toUpperCase();
    if (coupons[upperCoupon]) {
      dispatch(applyDiscount(upperCoupon));
      setMessage(`✅ Coupon applied! ${coupons[upperCoupon]}% discount`);
      setCouponInput('');
    } else {
      setMessage('❌ Invalid coupon code');
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleClearCoupon = () => {
    dispatch(clearDiscount());
    setMessage('Coupon removed');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Discount Coupons</h2>
        
        {appliedCoupon && (
          <div className="alert alert-success" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Active: {appliedCoupon} ({discount}% off)</span>
            <button
              onClick={handleClearCoupon}
              className="btn btn-link text-danger btn-sm"
              style={{ padding: 0 }}
            >
              Remove
            </button>
          </div>
        )}

        <div className="input-group mb-3">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter coupon code"
            className="form-control"
          />
          <button
            onClick={handleApplyCoupon}
            className="btn btn-primary"
          >
            Apply
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <div>
          <h5>Available Coupons:</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
            {Object.entries(coupons).map(([code, discount]) => (
              <div key={code} className="badge bg-secondary" style={{ padding: '0.5rem', textAlign: 'center' }}>
                <strong>{code}</strong> - {discount}% off
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = ({ activeTab, setActiveTab, cart, wishlist }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="text-center" style={{ width: '100%' }}>
          <h1 className="navbar-brand">🛒 Shopping Cart Redux</h1>
        </div>
        <div className="navbar-nav">
          <button
            onClick={() => setActiveTab('products')}
            className={`nav-link btn ${activeTab === 'products' ? 'active' : ''}`}
          >
            🛍️ Products
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`nav-link btn ${activeTab === 'cart' ? 'active' : ''}`}
          >
            🛒 Cart ({cart.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`nav-link btn ${activeTab === 'wishlist' ? 'active' : ''}`}
          >
            💖 Wishlist ({wishlist.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`nav-link btn ${activeTab === 'coupons' ? 'active' : ''}`}
          >
            🎫 Coupons
          </button>
        </div>
      </div>
    </nav>
  );
};

// Main App Component
const ShoppingCartApp = () => {
  const [activeTab, setActiveTab] = React.useState('products');
  const { state } = useShopping();
  const { cart, wishlist } = state;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} cart={cart} wishlist={wishlist} />

      <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        {activeTab === 'products' && (
          <div>
            <h2>Products</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              {sampleProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cart' && <Cart />}
        {activeTab === 'wishlist' && <Wishlist />}
        {activeTab === 'coupons' && <CouponSection />}
      </main>
    </div>
  );
};

// Root Component with Custom Provider
const App = () => {
  return (
    <ShoppingProvider>
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css" 
        rel="stylesheet"
      />
      <ShoppingCartApp />
    </ShoppingProvider>
  );
};

export default App;
