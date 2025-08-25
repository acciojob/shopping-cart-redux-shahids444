
import React, { useState } from 'react';
import { Provider, useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

// Types
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
}

interface CartState {
  items: CartItem[];
  wishlist: Product[];
  appliedCoupon: Coupon | null;
  total: number;
  discountAmount: number;
}

// Sample Data
const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    price: 199.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'High-quality wireless headphones with noise cancellation',
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Smart Watch Pro',
    price: 299.99,
    image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Advanced smartwatch with health monitoring features',
    category: 'Electronics'
  },
  {
    id: '3',
    name: 'Coffee Maker Deluxe',
    price: 149.99,
    image: 'https://images.pexels.com/photos/4226881/pexels-photo-4226881.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Premium coffee maker for the perfect brew every time',
    category: 'Home & Kitchen'
  },
  {
    id: '4',
    name: 'Leather Backpack',
    price: 89.99,
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Stylish leather backpack perfect for work or travel',
    category: 'Fashion'
  },
  {
    id: '5',
    name: 'Bluetooth Speaker',
    price: 79.99,
    image: 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Portable Bluetooth speaker with amazing sound quality',
    category: 'Electronics'
  },
  {
    id: '6',
    name: 'Fitness Tracker',
    price: 59.99,
    image: 'https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=500',
    description: 'Track your fitness goals with this advanced fitness tracker',
    category: 'Electronics'
  }
];

const availableCoupons: Coupon[] = [
  { code: 'SAVE10', discount: 10, type: 'percentage', description: '10% off your order' },
  { code: 'WELCOME20', discount: 20, type: 'percentage', description: '20% off for new customers' },
  { code: 'FIXED50', discount: 50, type: 'fixed', description: '$50 off orders over $200' },
  { code: 'SUMMER15', discount: 15, type: 'percentage', description: '15% summer discount' },
];

// Redux Store Setup
const initialState: CartState = {
  items: [],
  wishlist: [],
  appliedCoupon: null,
  total: 0,
  discountAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      cartSlice.caseReducers.calculateTotal(state);
    },
    
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    
    increaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        cartSlice.caseReducers.calculateTotal(state);
      }
    },
    
    decreaseQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        cartSlice.caseReducers.calculateTotal(state);
      }
    },
    
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const exists = state.wishlist.find(item => item.id === action.payload.id);
      if (!exists) {
        state.wishlist.push(action.payload);
      }
    },
    
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.wishlist = state.wishlist.filter(item => item.id !== action.payload);
    },
    
    applyCoupon: (state, action: PayloadAction<string>) => {
      const coupon = availableCoupons.find(c => c.code === action.payload.toUpperCase());
      if (coupon) {
        state.appliedCoupon = coupon;
        cartSlice.caseReducers.calculateTotal(state);
      }
    },
    
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      cartSlice.caseReducers.calculateTotal(state);
    },
    
    calculateTotal: (state) => {
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (state.appliedCoupon) {
        if (state.appliedCoupon.type === 'percentage') {
          state.discountAmount = (subtotal * state.appliedCoupon.discount) / 100;
        } else {
          state.discountAmount = Math.min(state.appliedCoupon.discount, subtotal);
        }
      } else {
        state.discountAmount = 0;
      }
      
      state.total = Math.max(0, subtotal - state.discountAmount);
    },
  },
});

const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, addToWishlist, removeFromWishlist, applyCoupon, removeCoupon } = cartSlice.actions;

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Components
const CouponBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 text-center">
          <span className="w-5 h-5 inline-block text-center">🏷️</span>
          <div className="flex-1">
            <p className="text-sm font-medium">🔥 Limited Time Offers!</p>
            <div className="flex justify-center gap-6 mt-1 text-xs opacity-90">
              {availableCoupons.map((coupon) => (
                <span key={coupon.code} className="bg-white/20 px-2 py-1 rounded">
                  {coupon.code}: {coupon.description}
                </span>
              ))}
            </div>
          </div>
          <span className="w-5 h-5 inline-block text-center">🕒</span>
        </div>
      </div>
    </div>
  );
};

interface HeaderProps {
  onCartClick: () => void;
  onWishlistClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onWishlistClick }) => {
  const { items, wishlist } = useAppSelector((state) => state.cart);
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <span className="w-8 h-8 inline-block text-center text-white">🏪</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopCart
              </h1>
              <p className="text-xs text-gray-500">Redux Shopping Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onWishlistClick}
              className="relative p-3 text-gray-600 hover:text-red-500 transition-colors group"
            >
              <span className="w-6 h-6 inline-block text-center group-hover:scale-110 transition-transform">❤️</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>
            
            <button
              onClick={onCartClick}
              className="relative p-3 text-gray-600 hover:text-blue-600 transition-colors group"
            >
              <span className="w-6 h-6 inline-block text-center group-hover:scale-110 transition-transform">🛒</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-bounce">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { items, wishlist } = useAppSelector((state) => state.cart);
  
  const cartItem = items.find(item => item.id === product.id);
  const isInWishlist = wishlist.some(item => item.id === product.id);
  
  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };
  
  const handleWishlistToggle = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleIncreaseQuantity = () => {
    dispatch(increaseQuantity(product.id));
  };

  const handleDecreaseQuantity = () => {
    dispatch(decreaseQuantity(product.id));
  };

  return (
    <div className="group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isInWishlist 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/80 text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <span className={`w-5 h-5 inline-block text-center ${isInWishlist ? 'fill-current' : ''}`}>❤️</span>
        </button>
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          
          {cartItem ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecreaseQuantity}
                className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="w-4 h-4 inline-block text-center">➖</span>
              </button>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
                {cartItem.quantity}
              </span>
              <button
                onClick={handleIncreaseQuantity}
                className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="w-4 h-4 inline-block text-center">➕</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <span className="w-4 h-4 inline-block text-center">🛒</span>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { items, total, discountAmount, appliedCoupon } = useAppSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      const coupon = availableCoupons.find(c => c.code === couponCode.trim().toUpperCase());
      if (coupon) {
        dispatch(applyCoupon(couponCode.trim()));
        setCouponCode('');
        setCouponError('');
      } else {
        setCouponError('Invalid coupon code');
      }
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 inline-block text-center text-white">🛍️</span>
              <h2 className="text-xl font-bold text-white">
                Shopping Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <span className="w-5 h-5 inline-block text-center">❌</span>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <span className="w-16 h-16 inline-block text-center text-gray-300 mx-auto mb-4">🛍️</span>
                <p className="text-gray-500 text-lg">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">${item.price.toFixed(2)} each</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                            className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <span className="w-4 h-4 inline-block text-center">➖</span>
                          </button>
                          <span className="px-3 py-1 bg-white rounded-md font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQuantity(item.id))}
                            className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <span className="w-4 h-4 inline-block text-center">➕</span>
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <span className="w-4 h-4 inline-block text-center">🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coupon Section */}
          {items.length > 0 && (
            <div className="p-6 border-t">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have a coupon code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 inline-block text-center">🏷️</span>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-500 text-sm mt-1">{couponError}</p>}
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-4">
                  <div>
                    <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                    <p className="text-green-600 text-sm">{appliedCoupon.description}</p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <span className="w-4 h-4 inline-block text-center">❌</span>
                  </button>
                </div>
              )}

              {/* Order Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
}

const Wishlist: React.FC<WishlistProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { wishlist } = useAppSelector((state) => state.cart);

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-red-500 to-pink-500">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 inline-block text-center text-white fill-current">❤️</span>
              <h2 className="text-xl font-bold text-white">
                Wishlist ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <span className="w-5 h-5 inline-block text-center">❌</span>
            </button>
          </div>

          {/* Wishlist Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {wishlist.length === 0 ? (
              <div className="text-center py-12">
                <span className="w-16 h-16 inline-block text-center text-gray-300 mx-auto mb-4">❤️</span>
                <p className="text-gray-500 text-lg">Your wishlist is empty</p>
                <p className="text-gray-400 text-sm">Add some products to save for later!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          ${item.price.toFixed(2)}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                          >
                            <span className="w-4 h-4 inline-block text-center">🛒</span>
                            Add to Cart
                          </button>
                          <button
                            onClick={() => dispatch(removeFromWishlist(item.id))}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <span className="w-4 h-4 inline-block text-center">❌</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header 
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
      />
      
      <CouponBanner />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated collection of premium products. 
            Add to cart, save to wishlist, and enjoy exclusive discounts!
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Wishlist isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
