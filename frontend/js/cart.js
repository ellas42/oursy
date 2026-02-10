const CART_KEY = 'cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  let cart = getCart();

  const existing = cart.find(
    item => item.id === product.id && item.size === product.size && item.color === product.color
  );

  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push(product);
  }

  saveCart(cart);
  updateCartCount();
  alert('✅ Added to cart!');
}

function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  if (typeof renderCart === 'function') {
    renderCart();
  }
  updateCartCount();
}

function updateQuantity(index, qty) {
  let cart = getCart();
  cart[index].quantity = Math.max(1, parseInt(qty));
  saveCart(cart);
  if (typeof renderCart === 'function') {
    renderCart();
  }
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const el = document.getElementById('cart-count');
  if (el) el.textContent = count;
}

document.addEventListener('DOMContentLoaded', updateCartCount);