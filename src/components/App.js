import React, { useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Heart, ShoppingCart, Plus, Minus, X, Trash2, Tag, ShoppingBag, Store, Clock } from 'lucide-react';

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
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      cartSlice.caseReducers.calculateTotal(state);
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    
    increaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
        cartSlice.caseReducers.calculateTotal(state);
      }
    },
    
    decreaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        cartSlice.caseReducers.calculateTotal(state);
      }
    },
    
    addToWishlist: (state, action) => {
      const exists = state.wishlist.find(item => item.id === action.payload.id);
      if (!exists) {
        state.wishlist.push(action.payload);
      }
    },
    
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(item => item.id !== action.payload);
    },
    
    applyCoupon: (state, action) => {
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

// CSS Styles
const styles = {
  // Global styles
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e1f5fe 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
  },

  // Header styles
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb'
  },

  headerContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '4rem'
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },

  logoIcon: {
    padding: '0.5rem',
    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
    borderRadius: '0.5rem',
    color: 'white'
  },

  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent'
  },

  logoSubtext: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },

  headerButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },

  headerButton: {
    position: 'relative',
    padding: '0.75rem',
    color: '#4b5563',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '0.5rem',
    transition: 'all 0.3s ease',
  },

  badge: {
    position: 'absolute',
    top: '-0.25rem',
    right: '-0.25rem',
    background: '#dc2626',
    color: 'white',
    fontSize: '0.75rem',
    borderRadius: '50%',
    height: '1.25rem',
    width: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500'
  },

  wishlistBadge: {
    background: '#dc2626',
    animation: 'pulse 2s infinite'
  },

  cartBadge: {
    background: '#2563eb',
    animation: 'bounce 1s infinite'
  },

  // Coupon Banner styles
  couponBanner: {
    background: 'linear-gradient(90deg, #fb923c, #ef4444, #ec4899)',
    color: 'white',
    padding: '1rem 0'
  },

  couponContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    textAlign: 'center'
  },

  couponContent: {
    flex: 1
  },

  couponTitle: {
    fontSize: '0.875rem',
    fontWeight: '500',
    marginBottom: '0.25rem'
  },

  couponCodes: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
    fontSize: '0.75rem',
    opacity: 0.9
  },

  couponCode: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem'
  },

  // Main content styles
  main: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem 1rem'
  },

  heroSection: {
    textAlign: 'center',
    marginBottom: '3rem'
  },

  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '1rem'
  },

  heroDescription: {
    fontSize: '1.125rem',
    color: '#4b5563',
    maxWidth: '32rem',
    margin: '0 auto'
  },

  // Product grid styles
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem'
  },

  // Product card styles
  productCard: {
    background: 'white',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },

  productImageContainer: {
    position: 'relative',
    overflow: 'hidden'
  },

  productImage: {
    width: '100%',
    height: '12rem',
    objectFit: 'cover',
    transition: 'transform 0.5s ease'
  },

  wishlistButton: {
    position: 'absolute',
    top: '0.75rem',
    right: '0.75rem',
    padding: '0.5rem',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },

  wishlistButtonDefault: {
    background: 'rgba(255, 255, 255, 0.8)',
    color: '#4b5563'
  },

  wishlistButtonActive: {
    background: '#ef4444',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },

  productContent: {
    padding: '1.5rem'
  },

  productCategory: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#2563eb',
    background: '#eff6ff',
    padding: '0.25rem 0.5rem',
    borderRadius: '9999px',
    display: 'inline-block',
    marginBottom: '0.5rem'
  },

  productName: {
    fontSize: '1.125rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '0.5rem',
    transition: 'color 0.3s ease'
  },

  productDescription: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '1rem',
    lineHeight: '1.5',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },

  productFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  productPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827'
  },

  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  quantityButton: {
    padding: '0.25rem',
    borderRadius: '0.5rem',
    background: '#f3f4f6',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },

  quantityDisplay: {
    padding: '0.25rem 0.75rem',
    background: '#dbeafe',
    color: '#1e40af',
    borderRadius: '0.5rem',
    fontWeight: '500'
  },

  addToCartButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
    color: 'white',
    borderRadius: '0.5rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  },

  // Modal styles
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    overflow: 'hidden'
  },

  modalBackdrop: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)'
  },

  modalContent: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: '100%',
    width: '100%',
    maxWidth: '32rem',
    background: 'white',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transform: 'translateX(0)',
    transition: 'transform 0.3s ease'
  },

  modalContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },

  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb'
  },

  modalTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '1.25rem',
    fontWeight: 'bold'
  },

  cartModalHeader: {
    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
    color: 'white'
  },

  wishlistModalHeader: {
    background: 'linear-gradient(45deg, #ef4444, #ec4899)',
    color: 'white'
  },

  closeButton: {
    padding: '0.5rem',
    borderRadius: '0.5rem',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },

  modalBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.5rem'
  },

  emptyState: {
    textAlign: 'center',
    paddingTop: '3rem',
    paddingBottom: '3rem'
  },

  emptyIcon: {
    width: '4rem',
    height: '4rem',
    color: '#d1d5db',
    margin: '0 auto 1rem'
  },

  emptyTitle: {
    color: '#6b7280',
    fontSize: '1.125rem',
    marginBottom: '0.5rem'
  },

  emptyDescription: {
    color: '#9ca3af',
    fontSize: '0.875rem'
  },

  // Item list styles
  itemList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },

  itemCard: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '0.75rem'
  },

  itemImage: {
    width: '4rem',
    height: '4rem',
    objectFit: 'cover',
    borderRadius: '0.5rem'
  },

  itemContent: {
    flex: 1
  },

  itemName: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.25rem'
  },

  itemPrice: {
    fontSize: '0.875rem',
    color: '#4b5563',
    marginBottom: '0.5rem'
  },

  itemFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },

  itemTotal: {
    fontWeight: 'bold',
    color: '#111827'
  },

  removeButton: {
    padding: '0.25rem',
    color: '#ef4444',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s ease'
  },

  // Coupon section styles
  couponSection: {
    padding: '1.5rem',
    borderTop: '1px solid #e5e7eb'
  },

  couponLabel: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '0.5rem'
  },

  couponInputGroup: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '0.5rem'
  },

  couponInputContainer: {
    position: 'relative',
    flex: 1
  },

  couponInput: {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: '0.5rem',
    paddingBottom: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },

  couponInputIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '1rem',
    height: '1rem',
    color: '#9ca3af'
  },

  applyCouponButton: {
    padding: '0.5rem 1rem',
    background: '#059669',
    color: 'white',
    borderRadius: '0.5rem',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },

  couponError: {
    color: '#ef4444',
    fontSize: '0.875rem',
    marginTop: '0.25rem'
  },

  appliedCoupon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem',
    background: '#f0fdf4',
    borderRadius: '0.5rem',
    marginBottom: '1rem'
  },

  appliedCouponInfo: {
    color: '#166534'
  },

  appliedCouponCode: {
    fontWeight: '500'
  },

  appliedCouponDesc: {
    fontSize: '0.875rem',
    color: '#15803d'
  },

  removeCouponButton: {
    color: '#15803d',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.3s ease'
  },

  // Order summary styles
  orderSummary: {
    marginBottom: '1rem'
  },

  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
    color: '#4b5563'
  },

  discountRow: {
    color: '#059669'
  },

  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '0.5rem',
    borderTop: '1px solid #e5e7eb',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#111827'
  },

  checkoutButton: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(45deg, #2563eb, #7c3aed)',
    color: 'white',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    fontSize: '1.125rem',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  },

  // Responsive styles
  '@media (max-width: 768px)': {
    couponCodes: {
      fontSize: '0.625rem',
      gap: '0.75rem'
    },
    
    heroTitle: {
      fontSize: '2rem'
    },
    
    productGrid: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1rem'
    }
  }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-25%); }
  }
  
  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .product-card:hover .product-image {
    transform: scale(1.1);
  }
  
  .product-card:hover .product-name {
    color: #2563eb;
  }
  
  .header-button:hover {
    color: #2563eb;
    transform: scale(1.1);
  }
  
  .quantity-button:hover {
    background-color: #e5e7eb;
  }
  
  .add-to-cart-button:hover {
    background: linear-gradient(45deg, #1d4ed8, #6d28d9);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .close-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  .apply-coupon-button:hover {
    background-color: #047857;
  }
  
  .remove-coupon-button:hover {
    color: #166534;
  }
  
  .checkout-button:hover {
    background: linear-gradient(45deg, #1d4ed8, #6d28d9);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  
  .remove-button:hover {
    color: #dc2626;
  }
  
  .coupon-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;
document.head.appendChild(styleSheet);

// Components
const CouponBanner = () => {
  return (
    <div style={styles.couponBanner}>
      <div style={styles.couponContainer}>
        <Tag size={20} />
        <div style={styles.couponContent}>
          <p style={styles.couponTitle}>🔥 Limited Time Offers!</p>
          <div style={styles.couponCodes}>
            {availableCoupons.map((coupon) => (
              <span key={coupon.code} style={styles.couponCode}>
                {coupon.code}: {coupon.description}
              </span>
            ))}
          </div>
        </div>
        <Clock size={20} />
      </div>
    </div>
  );
};

const Header = ({ onCartClick, onWishlistClick }) => {
  const { items, wishlist } = useSelector((state) => state.cart);
  const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header style={styles.header}>
      <div style={styles.headerContainer}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <Store size={32} />
          </div>
          <div>
            <h1 style={styles.logoText}>ShopCart</h1>
            <p style={styles.logoSubtext}>Redux Shopping Experience</p>
          </div>
        </div>

        <div style={styles.headerButtons}>
          <button
            onClick={onWishlistClick}
            style={styles.headerButton}
            className="header-button"
          >
            <Heart size={24} />
            {wishlist.length > 0 && (
              <span style={{...styles.badge, ...styles.wishlistBadge}}>
                {wishlist.length}
              </span>
            )}
          </button>
          
          <button
            onClick={onCartClick}
            style={styles.headerButton}
            className="header-button"
          >
            <ShoppingCart size={24} />
            {cartItemsCount > 0 && (
              <span style={{...styles.badge, ...styles.cartBadge}}>
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { items, wishlist } = useSelector((state) => state.cart);
  
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
    <div style={styles.productCard} className="product-card">
      <div style={styles.productImageContainer}>
        <img 
          src={product.image} 
          alt={product.name}
          style={styles.productImage}
          className="product-image"
        />
        <button
          onClick={handleWishlistToggle}
          style={isInWishlist ? {...styles.wishlistButton, ...styles.wishlistButtonActive} : {...styles.wishlistButton, ...styles.wishlistButtonDefault}}
        >
          <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
        </button>
      </div>
      
      <div style={styles.productContent}>
        <div style={styles.productCategory}>
          {product.category}
        </div>
        <h3 style={styles.productName} className="product-name">
          {product.name}
        </h3>
        <p style={styles.productDescription}>
          {product.description}
        </p>
        <div style={styles.productFooter}>
          <span style={styles.productPrice}>
            ${product.price.toFixed(2)}
          </span>
          
          {cartItem ? (
            <div style={styles.quantityControls}>
              <button
                onClick={handleDecreaseQuantity}
                style={styles.quantityButton}
                className="quantity-button"
              >
                <Minus size={16} />
              </button>
              <span style={styles.quantityDisplay}>
                {cartItem.quantity}
              </span>
              <button
                onClick={handleIncreaseQuantity}
                style={styles.quantityButton}
                className="quantity-button"
              >
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              style={styles.addToCartButton}
              className="add-to-cart-button"
            >
              <ShoppingCart size={16} />
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Cart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, total, discountAmount, appliedCoupon } = useSelector((state) => state.cart);
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
    <div style={styles.modalOverlay}>
      <div style={styles.modalBackdrop} onClick={onClose} />
      
      <div style={styles.modalContent}>
        <div style={styles.modalContainer}>
          <div style={{...styles.modalHeader, ...styles.cartModalHeader}}>
            <div style={styles.modalTitle}>
              <ShoppingBag size={24} />
              <h2>
                Shopping Cart ({items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              style={styles.closeButton}
              className="close-button"
            >
              <X size={20} />
            </button>
          </div>

          <div style={styles.modalBody}>
            {items.length === 0 ? (
              <div style={styles.emptyState}>
                <ShoppingBag style={styles.emptyIcon} />
                <p style={styles.emptyTitle}>Your cart is empty</p>
                <p style={styles.emptyDescription}>Add some products to get started!</p>
              </div>
            ) : (
              <div style={styles.itemList}>
                {items.map((item) => (
                  <div key={item.id} style={styles.itemCard}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={styles.itemImage}
                    />
                    <div style={styles.itemContent}>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemPrice}>${item.price.toFixed(2)} each</p>
                      
                      <div style={styles.itemFooter}>
                        <div style={styles.quantityControls}>
                          <button
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                            style={styles.quantityButton}
                            className="quantity-button"
                          >
                            <Minus size={16} />
                          </button>
                          <span style={styles.quantityDisplay}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(increaseQuantity(item.id))}
                            style={styles.quantityButton}
                            className="quantity-button"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        <div style={styles.itemActions}>
                          <span style={styles.itemTotal}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => dispatch(removeFromCart(item.id))}
                            style={styles.removeButton}
                            className="remove-button"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div style={styles.couponSection}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={styles.couponLabel}>
                  Have a coupon code?
                </label>
                <div style={styles.couponInputGroup}>
                  <div style={styles.couponInputContainer}>
                    <Tag style={styles.couponInputIcon} />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      style={styles.couponInput}
                      className="coupon-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    style={styles.applyCouponButton}
                    className="apply-coupon-button"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p style={styles.couponError}>{couponError}</p>}
              </div>

              {appliedCoupon && (
                <div style={styles.appliedCoupon}>
                  <div style={styles.appliedCouponInfo}>
                    <span style={styles.appliedCouponCode}>{appliedCoupon.code}</span>
                    <p style={styles.appliedCouponDesc}>{appliedCoupon.description}</p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    style={styles.removeCouponButton}
                    className="remove-coupon-button"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              <div style={styles.orderSummary}>
                <div style={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{...styles.summaryRow, ...styles.discountRow}}>
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={styles.totalRow}>
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                style={styles.checkoutButton}
                className="checkout-button"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Wishlist = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.cart);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
  };

  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBackdrop} onClick={onClose} />
      
      <div style={styles.modalContent}>
        <div style={styles.modalContainer}>
          <div style={{...styles.modalHeader, ...styles.wishlistModalHeader}}>
            <div style={styles.modalTitle}>
              <Heart size={24} fill="currentColor" />
              <h2>
                Wishlist ({wishlist.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              style={styles.closeButton}
              className="close-button"
            >
              <X size={20} />
            </button>
          </div>

          <div style={styles.modalBody}>
            {wishlist.length === 0 ? (
              <div style={styles.emptyState}>
                <Heart style={styles.emptyIcon} />
                <p style={styles.emptyTitle}>Your wishlist is empty</p>
                <p style={styles.emptyDescription}>Add some products to save for later!</p>
              </div>
            ) : (
              <div style={styles.itemList}>
                {wishlist.map((item) => (
                  <div key={item.id} style={styles.itemCard}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={styles.itemImage}
                    />
                    <div style={styles.itemContent}>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemPrice}>{item.description}</p>
                      <div style={styles.itemFooter}>
                        <span style={styles.itemTotal}>
                          ${item.price.toFixed(2)}
                        </span>
                        
                        <div style={styles.itemActions}>
                          <button
                            onClick={() => handleAddToCart(item)}
                            style={{...styles.addToCartButton, fontSize: '0.875rem', padding: '0.5rem 0.75rem'}}
                            className="add-to-cart-button"
                          >
                            <ShoppingCart size={16} />
                            Add to Cart
                          </button>
                          <button
                            onClick={() => dispatch(removeFromWishlist(item.id))}
                            style={styles.removeButton}
                            className="remove-button"
                          >
                            <X size={16} />
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

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  return (
    <div style={styles.app}>
      <Header 
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
      />
      
      <CouponBanner />
      
      <main style={styles.main}>
        <div style={styles.heroSection}>
          <h2 style={styles.heroTitle}>
            Featured Products
          </h2>
          <p style={styles.heroDescription}>
            Discover our curated collection of premium products. 
            Add to cart, save to wishlist, and enjoy exclusive discounts!
          </p>
        </div>
        
        <div style={styles.productGrid}>
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
