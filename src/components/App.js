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

// CSS Styles
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
    fontFamily: 'Arial, sans-serif'
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
    margin: '0'
  },
  subtitle: {
    color: '#6b7280',
    margin: '0'
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px'
  },
  navContainer: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '4px'
  },
  navButton: {
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginRight: '4px'
  },
  navButtonActive: {
    background: '#2563eb',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  navButtonInactive: {
    color: '#6b7280',
    background: 'transparent'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  productCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    transition: 'all 0.3s ease'
  },
  productCardHover: {
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  productImage: {
    fontSize: '4rem',
    textAlign: 'center',
    marginBottom: '12px'
  },
  productName: {
    fontWeight: 'bold',
    fontSize: '1.125rem',
    color: '#1f2937',
    marginBottom: '8px',
    textAlign: 'center'
  },
  productRating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    marginBottom: '8px'
  },
  productPrice: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#2563eb',
    textAlign: 'center',
    marginBottom: '16px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '8px'
  },
  addToCartButton: {
    flex: '1',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addToCartButtonDefault: {
    background: '#2563eb',
    color: 'white'
  },
  addToCartButtonInCart: {
    background: '#d1fae5',
    color: '#065f46',
    border: '1px solid #a7f3d0'
  },
  wishlistButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  wishlistButtonDefault: {
    background: '#f3f4f6',
    color: '#6b7280'
  },
  wishlistButtonActive: {
    background: '#fecaca',
    color: '#dc2626',
    border: '1px solid #fca5a5'
  },
  cartContainer: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '24px'
  },
  cartHeader: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center'
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  cartItemImage: {
    fontSize: '2rem'
  },
  cartItemDetails: {
    flex: '1'
  },
  cartItemName: {
    fontWeight: '600',
    marginBottom: '4px'
  },
  cartItemPrice: {
    color: '#6b7280'
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  quantityButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#e5e7eb',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s ease'
  },
  quantityDisplay: {
    width: '32px',
    textAlign: 'center',
    fontWeight: '500'
  },
  cartItemTotal: {
    textAlign: 'right'
  },
  cartItemTotalPrice: {
    fontWeight: '600'
  },
  removeButton: {
    color: '#dc2626',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    marginTop: '4px',
    fontSize: '1.2rem'
  },
  cartSummary: {
    borderTop: '1px solid #e5e7eb',
    paddingTop: '16px',
    marginTop: '24px'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  summaryTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '8px',
    marginTop: '8px'
  },
  discountRow: {
    color: '#059669'
  },
  emptyState: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '8px'
  },
  emptySubtitle: {
    color: '#9ca3af'
  },
  wishlistItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  wishlistItemImage: {
    fontSize: '2rem'
  },
  wishlistItemDetails: {
    flex: '1'
  },
  wishlistActions: {
    display: 'flex',
    gap: '8px'
  },
  wishlistActionButton: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  wishlistAddButton: {
    background: '#2563eb',
    color: 'white'
  },
  wishlistRemoveButton: {
    background: '#fecaca',
    color: '#dc2626'
  },
  couponSection: {
    marginBottom: '24px'
  },
  couponInputGroup: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px'
  },
  couponInput: {
    flex: '1',
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s ease'
  },
  couponApplyButton: {
    padding: '8px 24px',
    background: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.3s ease'
  },
  couponApplyButtonDisabled: {
    background: '#d1d5db',
    cursor: 'not-allowed'
  },
  couponNotification: {
    padding: '12px',
    background: '#d1fae5',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '12px'
  },
  couponNotificationText: {
    color: '#065f46',
    fontWeight: '500'
  },
  couponRemoveButton: {
    color: '#065f46',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem'
  },
  availableCoupons: {
    marginTop: '16px'
  },
  availableCouponsTitle: {
    fontWeight: '600',
    marginBottom: '12px'
  },
  couponCard: {
    padding: '12px',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    marginBottom: '8px'
  },
  couponCardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  couponCode: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#2563eb'
  },
  couponDescription: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  footer: {
    marginTop: '48px',
    textAlign: 'center',
    color: '#6b7280'
  },
  icon: {
    display: 'inline-block',
    fontSize: '1.2em',
    marginRight: '8px'
  }
};

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

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...styles.productCard,
        ...(isHovered ? styles.productCardHover : {})
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.productImage}>{product.image}</div>
      <h3 style={styles.productName}>{product.name}</h3>
      <div style={styles.productRating}>
        <span style={{ color: '#fbbf24' }}>★</span>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{product.rating}</span>
      </div>
      <p style={styles.productPrice}>${product.price}</p>
      
      <div style={styles.buttonGroup}>
        <button
          onClick={() => addToCart(product)}
          style={{
            ...styles.addToCartButton,
            ...(isInCart ? styles.addToCartButtonInCart : styles.addToCartButtonDefault)
          }}
          data-testid={`add-to-cart-${product.id}`}
        >
          <span style={styles.icon}>🛒</span>
          {isInCart ? 'In Cart' : 'Add to Cart'}
        </button>
        
        <button
          onClick={() => isInWishlist ? removeFromWishlist(product) : addToWishlist(product)}
          style={{
            ...styles.wishlistButton,
            ...(isInWishlist ? styles.wishlistButtonActive : styles.wishlistButtonDefault)
          }}
          data-testid={`add-to-wishlist-${product.id}`}
        >
          {isInWishlist ? '❤️' : '🤍'}
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
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>🛒</div>
        <h3 style={styles.emptyTitle}>Your cart is empty</h3>
        <p style={styles.emptySubtitle}>Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div style={styles.cartContainer}>
      <h2 style={styles.cartHeader}>
        <span style={styles.icon}>🛒</span>
        Shopping Cart ({state.cart.length})
      </h2>
      
      <div>
        {state.cart.map(item => (
          <div key={item.id} style={styles.cartItem}>
            <div style={styles.cartItemImage}>{item.image}</div>
            <div style={styles.cartItemDetails}>
              <h4 style={styles.cartItemName}>{item.name}</h4>
              <p style={styles.cartItemPrice}>${item.price}</p>
            </div>
            
            <div style={styles.quantityControls}>
              <button
                onClick={() => decreaseQuantity(item)}
                style={styles.quantityButton}
                disabled={item.quantity <= 1}
                data-testid={`decrease-quantity-${item.id}`}
              >
                ➖
              </button>
              <span style={styles.quantityDisplay}>{item.quantity}</span>
              <button
                onClick={() => increaseQuantity(item)}
                style={styles.quantityButton}
                data-testid={`increase-quantity-${item.id}`}
              >
                ➕
              </button>
            </div>
            
            <div style={styles.cartItemTotal}>
              <div style={styles.cartItemTotalPrice}>${(item.price * item.quantity).toFixed(2)}</div>
              <button
                onClick={() => removeFromCart(item)}
                style={styles.removeButton}
                data-testid={`remove-from-cart-${item.id}`}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.cartSummary}>
        <div style={styles.summaryRow}>
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        {state.appliedCoupon && (
          <div style={{ ...styles.summaryRow, ...styles.discountRow }}>
            <span>Discount ({state.appliedCoupon.code}):</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        <div style={styles.summaryTotal}>
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
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>💝</div>
        <h3 style={styles.emptyTitle}>Your wishlist is empty</h3>
        <p style={styles.emptySubtitle}>Save items you love for later!</p>
      </div>
    );
  }

  return (
    <div style={styles.cartContainer}>
      <h2 style={styles.cartHeader}>
        <span style={styles.icon}>❤️</span>
        Wishlist ({state.wishlist.length})
      </h2>
      
      <div>
        {state.wishlist.map(item => (
          <div key={item.id} style={styles.wishlistItem}>
            <div style={styles.wishlistItemImage}>{item.image}</div>
            <div style={styles.wishlistItemDetails}>
              <h4 style={styles.cartItemName}>{item.name}</h4>
              <p style={styles.cartItemPrice}>${item.price}</p>
            </div>
            <div style={styles.wishlistActions}>
              <button
                onClick={() => addToCart(item)}
                style={{ ...styles.wishlistActionButton, ...styles.wishlistAddButton }}
              >
                Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item)}
                style={{ ...styles.wishlistActionButton, ...styles.wishlistRemoveButton }}
                data-testid={`remove-from-wishlist-${item.id}`}
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
    <div style={styles.cartContainer}>
      <h2 style={styles.cartHeader}>
        <span style={styles.icon}>🏷️</span>
        Discount Coupons
      </h2>

      <div style={styles.couponSection}>
        <div style={styles.couponInputGroup}>
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder="Enter coupon code"
            style={styles.couponInput}
          />
          <button
            onClick={handleApplyCoupon}
            disabled={!couponInput.trim() || state.cart.length === 0}
            style={{
              ...styles.couponApplyButton,
              ...(!couponInput.trim() || state.cart.length === 0 ? styles.couponApplyButtonDisabled : {})
            }}
          >
            Apply
          </button>
        </div>
        
        {state.appliedCoupon && (
          <div style={styles.couponNotification}>
            <span style={styles.couponNotificationText}>
              {state.appliedCoupon.code} applied! {state.appliedCoupon.description}
            </span>
            <button
              onClick={removeCoupon}
              style={styles.couponRemoveButton}
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div style={styles.availableCoupons}>
        <h3 style={styles.availableCouponsTitle}>Available Coupons:</h3>
        <div>
          {state.coupons.map((coupon, index) => (
            <div key={index} style={styles.couponCard}>
              <div style={styles.couponCardContent}>
                <span style={styles.couponCode}>{coupon.code}</span>
                <span style={styles.couponDescription}>{coupon.description}</span>
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
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <header style={styles.header}>
          <h1 style={styles.title}>Shopping Cart Redux</h1>
          <p style={styles.subtitle}>Complete shopping experience with Redux state management</p>
        </header>

        <nav style={styles.nav}>
          <div style={styles.navContainer}>
            {[
              { id: 'products', label: 'Products', count: products.length },
              { id: 'cart', label: 'Cart', count: state.cart.length },
              { id: 'wishlist', label: 'Wishlist', count: state.wishlist.length },
              { id: 'coupons', label: 'Coupons', count: state.coupons.length }
            ].map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...styles.navButton,
                  ...(activeTab === tab.id ? styles.navButtonActive : styles.navButtonInactive),
                  marginRight: index === 3 ? '0' : '4px'
                }}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </nav>

        <main>
          {activeTab === 'products' && (
            <div style={styles.productGrid}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {activeTab === 'cart' && <Cart />}
          {activeTab === 'wishlist' && <Wishlist />}
          {activeTab === 'coupons' && <CouponSection />}
        </main>

        <footer style={styles.footer}>
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
