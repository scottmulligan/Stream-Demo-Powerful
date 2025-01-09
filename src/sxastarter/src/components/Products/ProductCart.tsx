import React, { useEffect, useState } from 'react';
import config from 'temp/config';

export interface CartItem {
  SKU: string;
  Name: string;
  Image1: {
    src: string;
    alt: string;
    width: string;
    height: string;
  };
  Price: number;
  Quantity: number;
}

export type ProductCartProps = {
  params: { [key: string]: string };
};

export const Default = (props: ProductCartProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  const publicUrl = config.publicUrl;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = () => {
    const cartData: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cartData);
    calculateTotal(cartData);
    setIsLoading(false);
  };

  const calculateTotal = (cartData: CartItem[]) => {
    const total = cartData.reduce((acc, item) => acc + item.Price * item.Quantity, 0);
    setTotalPrice(total);
  };

  const removeItem = (sku: string) => {
    const updatedCart = cartItems.filter((item) => item.SKU !== sku);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  const incrementQuantity = (sku: string) => {
    const updatedCart = cartItems.map((item) =>
      item.SKU === sku ? { ...item, Quantity: item.Quantity + 1 } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  const decrementQuantity = (sku: string) => {
    const updatedCart = cartItems.map((item) =>
      item.SKU === sku && item.Quantity > 1 ? { ...item, Quantity: item.Quantity - 1 } : item
    );
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotal(updatedCart);
  };

  return (
    <div
      className={`component product-cart ${props.params.styles.trimEnd()}`}
      id={id ? id : undefined}
    >
      {cartItems.length > 0 ? (
        <div className="cart-table-container">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.SKU}>
                  <td className="cart-product-info">
                    <img
                      src={item.Image1.src}
                      alt={item.Image1.alt}
                      className="cart-product-image"
                    />
                    <span className="cart-product-name">{item.Name}</span>
                  </td>
                  <td>${item.Price.toFixed(2)}</td>
                  <td>
                    <div className="quantity-control d-flex align-items-center gap-3">
                      <button
                        className="quantity-button button-clear-appearance"
                        onClick={() => decrementQuantity(item.SKU)}
                        aria-label="Decrease quantity"
                        disabled={item.Quantity <= 1}
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.Quantity}</span>
                      <button
                        className="quantity-button button-clear-appearance"
                        onClick={() => incrementQuantity(item.SKU)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="fw-bold">${(item.Quantity * item.Price).toFixed(2)}</td>
                  <td>
                    <button
                      className="remove-product-button button-clear-appearance"
                      onClick={() => removeItem(item.SKU)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="cart-summary d-flex justify-content-end w-auto">
            <div className="d-flex flex-column">
              <div className="cart-summary-details d-flex justify-content-between my-4">
                <span>Total</span>
                <span className="fw-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <button className="button button-main">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      ) : !isLoading ? (
        <div className="d-flex flex-column align-items-center">
          <img src={`${publicUrl}/empty-cart.png`} alt="Empty Cart" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
