import React, { useState, useReducer } from 'react';

// Initial state
const initialState = {
  products: [
    {
      id: 1,
      name: "Wireless Headphones",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Bluetooth Speaker",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=200&fit=crop"
    },
    {
      id: 4,
      name: "Laptop Stand",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop"
    },
    {
      id: 5,
      name: "USB-C Hub",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=300&h=200&fit=crop"
    },
    {
      id: 6,
      name: "Wireless Mouse",
      price: 29.99,
      image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop"
    }
  ],
  cart: [],
  wishlist: [],
  couponCode: '',
  appliedCoupon: null,
  discountPercentage: 0,
  activeTab: 'products'
};

// Action types
const actionTypes = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
  REMOVE_FROM_WISHLIST: 'REMOVE_FROM_WISHLIST',
  MOVE_TO_CART: 'MOVE_TO_CART',
  APPLY_COUPON: 'APPLY_COUPON',
  REMOVE_COUPON: 'REMOVE_COUPON',
  SET_ACTIVE_TAB: 'SET_ACTIVE_TAB'
};

// Reducer function
const shoppingReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_TO_CART:
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

    case actionTypes.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };

    case actionTypes.UPDATE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case actionTypes.ADD_TO_WISHLIST:
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload]
      };

    case actionTypes.REMOVE_FROM_WISHLIST:
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload)
      };

    case actionTypes.MOVE_TO_CART:
      const wishlistItem = state.wishlist.find(item => item.id === action.payload);
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
        cart: [...state.cart, { ...wishlistItem, quantity: 1 }]
      };

    case actionTypes.APPLY_COUPON:
      const validCoupons = {
        'SAVE10': 10,
        'SAVE20': 20,
        'WELCOME15': 15
      };
      
      if (validCoupons[action.payload]) {
        return {
          ...state,
          appliedCoupon: action.payload,
          discountPercentage: validCoupons[action.payload]
        };
      }
      return state;

    case actionTypes.REMOVE_COUPON:
      return {
        ...state,
        appliedCoupon: null,
        discountPercentage: 0
      };

    case actionTypes.SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      };

    default:
      return state;
  }
};

const ShoppingCart = () => {
  const [state, dispatch] = useReducer(shoppingReducer, initialState);
  const [couponInput, setCouponInput] = useState('');

  // Calculate totals
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = (subtotal * state.discountPercentage) / 100;
  const total = subtotal - discountAmount;

  const handleAddToCart = (product) => {
    dispatch({ type: actionTypes.ADD_TO_CART, payload: product });
  };

  const handleRemoveFromCart = (productId) => {
    dispatch({ type: actionTypes.REMOVE_FROM_CART, payload: productId });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    dispatch({ 
      type: actionTypes.UPDATE_QUANTITY, 
      payload: { id: productId, quantity: newQuantity } 
    });
  };

  const handleAddToWishlist = (product) => {
    dispatch({ type: actionTypes.ADD_TO_WISHLIST, payload: product });
  };

  const handleRemoveFromWishlist = (productId) => {
    dispatch({ type: actionTypes.REMOVE_FROM_WISHLIST, payload: productId });
  };

  const handleMoveToCart = (productId) => {
    dispatch({ type: actionTypes.MOVE_TO_CART, payload: productId });
  };

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      dispatch({ type: actionTypes.APPLY_COUPON, payload: couponInput.toUpperCase() });
      setCouponInput('');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch({ type: actionTypes.REMOVE_COUPON });
  };

  const setActiveTab = (tab) => {
    dispatch({ type: actionTypes.SET_ACTIVE_TAB, payload: tab });
  };

  return (
    <>
      {/* First child - Navbar Header */}
      <nav className="navbar navbar-expand-lg" style={{
        backgroundColor: '#282c34',
        color: 'white',
        padding: '1rem',
        marginBottom: '2rem',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="text-center" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
          Shopping Cart - Redux Assignment
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              backgroundColor: state.activeTab === 'products' ? '#4fa8c5' : '#61dafb',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#282c34'
            }}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            style={{
              backgroundColor: state.activeTab === 'cart' ? '#4fa8c5' : '#61dafb',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#282c34'
            }}
          >
            Cart ({state.cart.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            style={{
              backgroundColor: state.activeTab === 'wishlist' ? '#4fa8c5' : '#61dafb',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#282c34'
            }}
          >
            Wishlist ({state.wishlist.length})
          </button>
        </div>
      </nav>

      {/* Second child - Main Content Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: window.innerWidth > 768 ? '2fr 1fr' : '1fr',
        gap: '2rem'
      }}>
        {/* Products Tab */}
        {state.activeTab === 'products' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
            gridColumn: window.innerWidth > 768 ? '1 / -1' : '1'
          }}>
            <h3 style={{ 
              gridColumn: '1 / -1',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#333'
            }}>
              Products
            </h3>
            {state.products.map(product => (
              <div
                key={product.id}
                className="custom-card card"
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.2s'
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <div className="card-body" style={{ padding: '1rem' }}>
                  <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                    {product.name}
                  </h4>
                  <p style={{
                    fontWeight: 'bold',
                    color: '#e91e63',
                    marginBottom: '1rem'
                  }}>
                    ${product.price.toFixed(2)}
                  </p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleAddToCart(product)}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        backgroundColor: '#4caf50',
                        color: 'white'
                      }}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleAddToWishlist(product)}
                      style={{
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        backgroundColor: '#ff9800',
                        color: 'white'
                      }}
                    >
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Cart Tab */}
        {state.activeTab === 'cart' && (
          <>
            <div>
              <h3 style={{ 
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#333'
              }}>
                Shopping Cart
              </h3>
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}>
                {state.cart.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem',
                    color: '#777'
                  }}>
                    Your cart is empty
                  </div>
                ) : (
                  <div className="cart-items">
                    {state.cart.map(item => (
                      <div
                        key={item.id}
                        className="cart-item"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '1rem 0',
                          borderBottom: '1px solid #eee'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }}
                          />
                          <div>
                            <h4>{item.name}</h4>
                            <p>${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem'
                        }}>
                          <div className="quantity-controls" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <button
                              className="quantity-decrease"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                background: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              -
                            </button>
                            <span className="quantity">{item.quantity}</span>
                            <button
                              className="quantity-increase"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                background: 'white',
                                cursor: 'pointer'
                              }}
                            >
                              +
                            </button>
                          </div>
                          <button
                            className="remove-btn"
                            onClick={() => handleRemoveFromCart(item.id)}
                            style={{
                              backgroundColor: '#f44336',
                              color: 'white',
                              border: 'none',
                              padding: '0.3rem 0.7rem',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cart Summary */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}>
              <h3>Order Summary</h3>
              
              {/* Coupon Section */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #eee'
              }}>
                <h4>Coupon Code</h4>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '0.5rem'
                }}>
                  <input
                    type="text"
                    className="coupon-input"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter coupon code"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  />
                  <button
                    className="apply-coupon-btn"
                    onClick={handleApplyCoupon}
                    style={{
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      backgroundColor: '#4caf50',
                      color: 'white'
                    }}
                  >
                    Apply
                  </button>
                </div>
                {state.appliedCoupon && (
                  <div style={{ marginTop: '0.5rem', color: '#4caf50' }}>
                    Coupon "{state.appliedCoupon}" applied! 
                    <button
                      onClick={handleRemoveCoupon}
                      style={{
                        marginLeft: '0.5rem',
                        background: 'none',
                        border: 'none',
                        color: '#f44336',
                        cursor: 'pointer'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
                <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                  Try: SAVE10, SAVE20, or WELCOME15
                </p>
              </div>

              {/* Summary */}
              <div className="cart-summary" style={{
                marginTop: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #eee'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span>Subtotal:</span>
                  <span className="subtotal">${subtotal.toFixed(2)}</span>
                </div>
                {state.discountPercentage > 0 && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    color: '#4caf50'
                  }}>
                    <span>Discount ({state.discountPercentage}%):</span>
                    <span className="discount">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #ddd'
                }}>
                  <span>Total:</span>
                  <span className="total">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Wishlist Tab */}
        {state.activeTab === 'wishlist' && (
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            gridColumn: window.innerWidth > 768 ? '1 / -1' : '1'
          }}>
            <h3 style={{ 
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#333'
            }}>
              Wishlist
            </h3>
            {state.wishlist.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#777'
              }}>
                Your wishlist is empty
              </div>
            ) : (
              <div className="wishlist-items">
                {state.wishlist.map(item => (
                  <div
                    key={item.id}
                    className="wishlist-item"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem 0',
                      borderBottom: '1px solid #eee'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                      <div>
                        <h4>{item.name}</h4>
                        <p>${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        className="move-to-cart-btn"
                        onClick={() => handleMoveToCart(item.id)}
                        style={{
                          padding: '0.5rem 1rem',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          backgroundColor: '#4caf50',
                          color: 'white'
                        }}
                      >
                        Move to Cart
                      </button>
                      <button
                        className="remove-from-wishlist-btn"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '0.3rem 0.7rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCart;
