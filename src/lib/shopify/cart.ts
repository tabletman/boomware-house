/**
 * Shopping cart service for Shopify Cart API
 */

import { shopifyFetch } from './client';
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_LINE_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  GET_CART_QUERY,
} from './queries';
import type {
  ShopifyCart,
  CartCreateResponse,
  CartLinesAddResponse,
  CartResponse,
} from './types';

const CART_ID_KEY = 'shopify-cart-id';

/**
 * Get cart ID from localStorage
 */
export function getCartId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CART_ID_KEY);
}

/**
 * Set cart ID in localStorage
 */
export function setCartId(cartId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_ID_KEY, cartId);
}

/**
 * Clear cart ID from localStorage
 */
export function clearCartId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_ID_KEY);
}

/**
 * Create a new cart
 */
export async function createCart(): Promise<ShopifyCart | null> {
  try {
    const data = await shopifyFetch<CartCreateResponse>({
      query: CREATE_CART_MUTATION,
      variables: {
        input: {},
      },
      cache: 'no-store',
    });

    if (data.cartCreate.userErrors.length > 0) {
      console.error('Cart creation errors:', data.cartCreate.userErrors);
      return null;
    }

    const cart = data.cartCreate.cart;
    setCartId(cart.id);
    return cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    return null;
  }
}

/**
 * Get current cart or create a new one
 */
export async function getCart(): Promise<ShopifyCart | null> {
  const cartId = getCartId();

  if (!cartId) {
    return createCart();
  }

  try {
    const data = await shopifyFetch<CartResponse>({
      query: GET_CART_QUERY,
      variables: { cartId },
      cache: 'no-store',
    });

    if (!data.cart) {
      // Cart not found, create a new one
      clearCartId();
      return createCart();
    }

    return data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    clearCartId();
    return createCart();
  }
}

/**
 * Add item to cart
 */
export async function addToCart(
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart | null> {
  let cartId = getCartId();

  // Create cart if it doesn't exist
  if (!cartId) {
    const newCart = await createCart();
    if (!newCart) return null;
    cartId = newCart.id;
  }

  try {
    const data = await shopifyFetch<CartLinesAddResponse>({
      query: ADD_TO_CART_MUTATION,
      variables: {
        cartId,
        lines: [
          {
            merchandiseId: variantId,
            quantity,
          },
        ],
      },
      cache: 'no-store',
    });

    if (data.cartLinesAdd.userErrors.length > 0) {
      console.error('Add to cart errors:', data.cartLinesAdd.userErrors);
      return null;
    }

    return data.cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

/**
 * Update cart line quantity
 */
export async function updateCartLine(
  lineId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  const cartId = getCartId();
  if (!cartId) return null;

  try {
    const data = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart; userErrors: Array<{ field: string[]; message: string }> } }>({
      query: UPDATE_CART_LINE_MUTATION,
      variables: {
        cartId,
        lines: [
          {
            id: lineId,
            quantity,
          },
        ],
      },
      cache: 'no-store',
    });

    if (data.cartLinesUpdate.userErrors.length > 0) {
      console.error('Update cart errors:', data.cartLinesUpdate.userErrors);
      return null;
    }

    return data.cartLinesUpdate.cart;
  } catch (error) {
    console.error('Error updating cart:', error);
    return null;
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(lineId: string): Promise<ShopifyCart | null> {
  const cartId = getCartId();
  if (!cartId) return null;

  try {
    const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart; userErrors: Array<{ field: string[]; message: string }> } }>({
      query: REMOVE_FROM_CART_MUTATION,
      variables: {
        cartId,
        lineIds: [lineId],
      },
      cache: 'no-store',
    });

    if (data.cartLinesRemove.userErrors.length > 0) {
      console.error('Remove from cart errors:', data.cartLinesRemove.userErrors);
      return null;
    }

    return data.cartLinesRemove.cart;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return null;
  }
}
