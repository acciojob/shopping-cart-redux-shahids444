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

// Icon Components using Unicode symbols
const CartIcon = ({ className }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: '1.2em' }}>🛒</span>
);

const HeartIcon = ({ className, filled }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: '1.2em' }}>
    {filled ? '❤️' : '🤍'}
  </span>
);

const PlusIcon = ({ className }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: '1.2em' }}>➕</span>
);

const MinusIcon = ({ className }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: '1.2em' }}>➖</span>
);

const TrashIcon = ({ className }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: '1.2em' }}>🗑️</span>
);

const TagIcon = ({ className }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: '1.2em' }}>🏷️</span>
);

const StarIcon = ({ className, filled }) => (
  <span className={`inline-block ${className}`} style={{ fontSize: '1em', color: '#fbbf24' }}>
    {filled ? '★' : '☆'}
  </span>
);

// Product Card Component
const ProductCard = ({ product }) => {
  const { state, addToCart, addToWishlist, removeFromWishlist } = useCart();
  
  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const isInCart = state.cart.some(item => item.id === product.id);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="text-center mb-4">
        <div className="text-6xl mb-3">{product.image}</div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center justify-center gap-1 mb-2">
          <StarIcon filled />
          <span className="text-sm text-gray-600">{product.rating}</span>
        </div>
        <p className="text-2xl font-bold text-blue-600">${product.price}</p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => addToCart(product)}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center ${
            isInCart 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <CartIcon className="mr-2" />
          {isInCart ? 'In Cart' : 'Add to Cart'}
        </button>
        
        <button
          onClick={() => isInWishlist ? removeFromWishlist(product) : addToWishlist(product)}
          className={`px-4 py-2 rounded-lg transition-all ${
            isInWishlist 
              ? 'bg-red-100 text-red-600 border border-red-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <HeartIcon filled={isInWishlist} />
        </button>
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
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
        <p className="text-gray-500">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <CartIcon className="mr-2" />
        Shopping Cart ({state.cart.length})
      </h2>
      
      <div className="space-y-4 mb-6">
        {state.cart.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="text-3xl">{item.image}</div>
            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-gray-600">${item.price}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseQuantity(item)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                disabled={item.quantity <= 1}
              >
                <MinusIcon />
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => increaseQuantity(item)}
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
              >
                <PlusIcon />
              </button>
            </div>
            
            <div className="text-right">
              <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
              <button
                onClick={() => removeFromCart(item)}
                className="text-red-500 hover:text-red-700 mt-1"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {state.appliedCoupon && (
          <div className="flex justify-between text-green-600">
            <span>Discount ({state.appliedCoupon.code}):</span>
            <span>-${discount.toFixed(2)}</span>
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
  const { state, removeFromWishlist, addToCart } = useCart();

  if (state.wishlist.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">💝</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-500">Save items you love for later!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <HeartIcon className="mr-2" filled />
        Wishlist ({state.wishlist.length})
      </h2>
      
      <div className="grid gap-4">
        {state.wishlist.map(item => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="text-3xl">{item.image}</div>
            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-gray-600">${item.price}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => addToCart(item)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
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
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <TagIcon className="mr-2" />
        Discount Coupons
      </h2>

      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleApplyCoupon}
            disabled={!couponInput.trim() || state.cart.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Apply
          </button>
        </div>
        
        {state.appliedCoupon && (
          <div className="mt-3 p-3 bg-green-100 rounded-lg flex items-center justify-between">
            <span className="text-green-700 font-medium">
              {state.appliedCoupon.code} applied! {state.appliedCoupon.description}
            </span>
            <button
              onClick={removeCoupon}
              className="text-green-700 hover:text-green-900"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-3">Available Coupons:</h3>
        <div className="space-y-2">
          {state.coupons.map((coupon, index) => (
            <div key={index} className="p-3 border border-dashed border-gray-300 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-blue-600">{coupon.code}</span>
                <span className="text-sm text-gray-600">{coupon.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const ShoppingCartApp = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { state } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Shopping Cart Redux</h1>
          <p className="text-gray-600">Complete shopping experience with Redux state management</p>
        </header>

        <nav className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-1">
            {[
              { id: 'products', label: 'Products', count: products.length },
              { id: 'cart', label: 'Cart', count: state.cart.length },
              { id: 'wishlist', label: 'Wishlist', count: state.wishlist.length },
              { id: 'coupons', label: 'Coupons', count: state.coupons.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </nav>

        <main>
          {activeTab === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {activeTab === 'cart' && <Cart />}
          {activeTab === 'wishlist' && <Wishlist />}
          {activeTab === 'coupons' && <CouponSection />}
        </main>

        <footer className="mt-12 text-center text-gray-600">
          <p>Built with React & Redux • Complete cart management system</p>
        </footer>
      </div>
    </div>
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
