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
    <div className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow">
      <div className="text-center mb-3">
        <div className="text-4xl mb-2">{product.image}</div>
        <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.category}</p>
        <p className="text-xl font-bold text-blue-600">${product.price}</p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => dispatch(addToCart(product))}
          className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
            isInCart
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isInCart ? '✓ In Cart' : '🛒 Add to Cart'}
        </button>
        
        <button
          onClick={() => 
            isInWishlist 
              ? dispatch(removeFromWishlist(product.id))
              : dispatch(addToWishlist(product))
          }
          className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
            isInWishlist
              ? 'bg-red-100 text-red-600 border border-red-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {isInWishlist ? '💔' : '💖'}
        </button>
      </div>
    </div>
  );
};

// Cart Item Component
const CartItem = ({ item }) => {
  const { dispatch } = useShopping();

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow border">
      <div className="text-2xl">{item.image}</div>
      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
        <p className="text-gray-600">${item.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(decreaseQuantity(item.id))}
          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
        >
          −
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => dispatch(increaseQuantity(item.id))}
          className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center font-bold"
        >
          +
        </button>
      </div>
      <div className="text-right">
        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => dispatch(removeFromCart(item.id))}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
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
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-4xl mb-4">🛒</div>
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Shopping Cart ({cart.length})</h2>
      
      <div className="space-y-4 mb-6">
        {cart.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({appliedCoupon}):</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-xl font-bold border-t pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
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
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-4xl mb-4">💖</div>
        <p className="text-gray-600">Your wishlist is empty</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Wishlist ({wishlist.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wishlist.map(product => (
          <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="text-2xl">{product.image}</div>
            <div className="flex-1">
              <h4 className="font-semibold">{product.name}</h4>
              <p className="text-blue-600 font-bold">${product.price}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => dispatch(addToCart(product))}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={() => dispatch(removeFromWishlist(product.id))}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Discount Coupons</h2>
      
      {appliedCoupon && (
        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded">
          <div className="flex justify-between items-center">
            <span className="text-green-700">
              Active: {appliedCoupon} ({discount}% off)
            </span>
            <button
              onClick={handleClearCoupon}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={couponInput}
          onChange={(e) => setCouponInput(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleApplyCoupon}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Apply
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-2 rounded text-sm ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Available Coupons:</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(coupons).map(([code, discount]) => (
            <div key={code} className="p-2 bg-gray-100 rounded text-sm text-center">
              <strong>{code}</strong> - {discount}% off
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const ShoppingCartApp = () => {
  const [activeTab, setActiveTab] = React.useState('products');
  const { state } = useShopping();
  const { cart, wishlist } = state;

  const tabs = [
    { id: 'products', label: 'Products', icon: '🛍️' },
    { id: 'cart', label: `Cart (${cart.length})`, icon: '🛒' },
    { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: '💖' },
    { id: 'coupons', label: 'Coupons', icon: '🎫' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900">🛒 Shopping Cart Redux</h1>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'products' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <ShoppingCartApp />
    </ShoppingProvider>
  );
};

export default App;
