import React, { useState } from 'react';
import { Field, ImageField, NextImage, Text } from '@sitecore-jss/sitecore-jss-nextjs';
import { CartItem } from './ProductCart';

interface Fields {
  Name: Field<string>;
  Slogan: Field<string>;
  Description: Field<string>;
  Price: Field<number>;
  Image1: ImageField;
  Image2: ImageField;
}

export type ProductDetailsProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: ProductDetailsProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const addToCart = () => {
    setLoading(true);
    const productSKU = props.fields.Name.value.replace(/\s+/g, '-').toLowerCase();
    const newProduct = {
      SKU: productSKU,
      Name: props.fields.Name.value,
      Image1: props.fields.Image1.value,
      Price: props.fields.Price.value,
      Quantity: quantity,
    };

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingProductIndex = cart.findIndex((item: CartItem) => item.SKU === productSKU);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].Quantity += quantity;
    } else {
      cart.push(newProduct);
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 500); // Checkmark shows for 0.5s
    }, 500); // Simulate a 0.5s delay for adding to the cart
  };

  return (
    <div
      className={`component product-details ${props.params.styles.trimEnd()}`}
      id={id ? id : undefined}
    >
      <div className="container">
        <div className="row row-gap-5 g-5">
          <div className="col-md-10 mx-auto col-lg-6">
            <NextImage field={props.fields.Image1} className={'img-fluid'} />
            <NextImage field={props.fields.Image2} className={'img-fluid'} />
          </div>
          <div className="col-lg-6 text-center text-lg-start">
            <h6 className="eyebrow-accent mt-2">
              <Text field={props.fields?.Slogan} />
            </h6>
            <h1 className="display-6 fw-bold mb-3">
              <Text field={props.fields?.Name} />
            </h1>
            <h4 className="fs-5 mb-3">
              $<Text field={props.fields?.Price} />
            </h4>
            <div className="col-lg-10 fs-5 mb-3">
              <p>
                <Text field={props.fields?.Description} />
              </p>
            </div>
            <div className="product-details-footer d-flex align-items-center justify-content-between gap-3 mt-3 pt-3">
              <div className="quantity-control d-flex align-items-center gap-3">
                <strong>Quantity:</strong>
                <button
                  className="quantity-button button-clear-appearance"
                  onClick={decrementQuantity}
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 ? true : false}
                >
                  −
                </button>
                <span className="quantity-value">{quantity}</span>
                <button
                  className="quantity-button button-clear-appearance"
                  onClick={incrementQuantity}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                className="button button-main add-to-cart"
                onClick={addToCart}
                disabled={loading}
              >
                {loading ? (
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : success ? (
                  <span>&#10003;</span> // Checkmark icon
                ) : (
                  'Add to cart'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
