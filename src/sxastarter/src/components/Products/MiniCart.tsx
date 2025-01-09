import React, { useRef, useState } from 'react';
import { CartItem } from './ProductCart';
import ClickOutside from './ClickOutside';
import { useRouter } from 'next/router';

export const MiniCart = (): JSX.Element => {
  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);

  const loadCartItems = () => {
    const cartData: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cartData);
    calculateTotal(cartData);
  };

  const calculateTotal = (cartData: CartItem[]) => {
    const total = cartData.reduce((acc, item) => acc + item.Price * item.Quantity, 0);
    setTotalPrice(total);
  };

  const handleToggle = () => {
    if (!isOpen) {
      loadCartItems();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleViewCart = () => {
    setIsOpen(false);
    router.push(`/products/cart`);
  };

  ClickOutside([containerRef, buttonRef], () => setIsOpen(false));

  return (
    <div className={`component mini-cart`}>
      <button className="button-clear-appearance" onClick={handleToggle} ref={buttonRef}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          version="1.1"
          id="Capa_1"
          width="24px"
          height="24px"
          viewBox="0 0 902.86 902.86"
        >
          <g>
            <g>
              <path d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z     M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z" />
              <path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717    c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744    c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742    C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744    c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z     M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742    S619.162,694.432,619.162,716.897z" />
            </g>
          </g>
        </svg>
      </button>
      {isOpen && (
        <div className="mini-cart-popup" ref={containerRef}>
          {cartItems.length > 0 ? (
            <div className="cart-table-container">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.SKU}>
                      <td className="cart-product-info">
                        <img
                          src={item.Image1.src}
                          alt={item.Image1.alt}
                          className="cart-product-image small"
                        />
                        <span className="cart-product-name">{item.Name}</span>
                      </td>
                      <td>${item.Price.toFixed(2)}</td>
                      <td>{item.Quantity}</td>
                      <td className="fw-bold">${(item.Quantity * item.Price).toFixed(2)}</td>
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
                  <button className="button button-main" onClick={handleViewCart}>
                    View Cart
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-column align-items-center">
              <h3>Your cart is empty</h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
