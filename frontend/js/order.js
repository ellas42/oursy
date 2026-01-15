// ========================================
// Order Form Page - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Product data
  const products = [
    { id: 1, value: 'midnight-set', name: 'Midnight Set', price: 89, stock: 3 },
    { id: 2, value: 'sand-dune-set', name: 'Sand Dune Set', price: 85, stock: 2 },
    { id: 3, value: 'blush-wave-set', name: 'Blush Wave Set', price: 92, stock: 3 },
    { id: 4, value: 'sunset-glow-set', name: 'Sunset Glow Set', price: 88, stock: 1 },
    { id: 5, value: 'ocean-breeze-set', name: 'Ocean Breeze Set', price: 95, stock: 2 },
    { id: 6, value: 'coral-reef-set', name: 'Coral Reef Set', price: 79, stock: 3 },
    { id: 7, value: 'golden-hour-set', name: 'Golden Hour Set', price: 98, stock: 1 },
    { id: 8, value: 'sea-mist-set', name: 'Sea Mist Set', price: 82, stock: 2 },
  ];

  // DOM Elements
  const orderForm = document.getElementById('order-form');
  const productSelect = document.getElementById('product-select');
  const sizeSelect = document.getElementById('size-select');
  const quantitySelect = document.getElementById('quantity-select');
  const stockNote = document.getElementById('stock-note');
  const stockNoteText = document.getElementById('stock-note-text');
  const summaryProduct = document.getElementById('summary-product');
  const summaryTotals = document.getElementById('summary-totals');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryTotal = document.getElementById('summary-total');
  const miniCarousel = document.getElementById('mini-carousel');
  const miniPrev = document.getElementById('mini-prev');
  const miniNext = document.getElementById('mini-next');

  // State
  let selectedProduct = null;
  let selectedSize = '';
  let selectedQuantity = 1;

  // ========================================
  // Pre-fill from URL params (coming from product page)
  // ========================================
  function initFromParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    const size = urlParams.get('size');
    const stock = urlParams.get('stock');
    
    if (productId) {
      const product = products.find(function(p) { return p.id === parseInt(productId); });
      if (product) {
        productSelect.value = product.value;
        selectedProduct = product;
        updateStockNote(product.stock);
        updateQuantityOptions(product.stock);
        updateSummary();
      }
    }
    
    if (size) {
      sizeSelect.value = size;
      selectedSize = size;
    }
  }

  // ========================================
  // Product Selection
  // ========================================
  productSelect.addEventListener('change', function() {
    const productValue = this.value;
    
    if (!productValue) {
      selectedProduct = null;
      stockNote.style.display = 'none';
      resetQuantityOptions();
      updateSummary();
      return;
    }
    
    selectedProduct = products.find(function(p) { return p.value === productValue; });
    
    if (selectedProduct) {
      updateStockNote(selectedProduct.stock);
      updateQuantityOptions(selectedProduct.stock);
      updateSummary();
    }
  });

  function updateStockNote(stock) {
    stockNote.style.display = 'flex';
    
    if (stock >= 3) {
      stockNote.className = 'stock-note';
      stockNoteText.textContent = 'In Stock - ' + stock + ' available';
    } else if (stock >= 1) {
      stockNote.className = 'stock-note low';
      stockNoteText.textContent = 'Low Stock - Only ' + stock + ' left';
    }
  }

  function updateQuantityOptions(maxStock) {
    const maxQty = Math.min(maxStock, 3);
    quantitySelect.innerHTML = '<option value="">Select quantity</option>';
    
    for (let i = 1; i <= maxQty; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      quantitySelect.appendChild(option);
    }
    
    // Pre-select 1 if available
    if (maxQty >= 1) {
      quantitySelect.value = '1';
      selectedQuantity = 1;
    }
  }

  function resetQuantityOptions() {
    quantitySelect.innerHTML = 
      '<option value="">Select quantity</option>' +
      '<option value="1">1</option>' +
      '<option value="2">2</option>' +
      '<option value="3">3</option>';
    selectedQuantity = 1;
  }

  // ========================================
  // Quantity & Size Selection
  // ========================================
  quantitySelect.addEventListener('change', function() {
    selectedQuantity = parseInt(this.value) || 1;
    updateSummary();
  });

  sizeSelect.addEventListener('change', function() {
    selectedSize = this.value;
  });

  // ========================================
  // Update Order Summary
  // ========================================
  function updateSummary() {
    if (!selectedProduct) {
      summaryProduct.innerHTML = '<p class="summary-empty">Select a product to see summary</p>';
      summaryTotals.style.display = 'none';
      return;
    }
    
    const subtotal = selectedProduct.price * selectedQuantity;
    const total = subtotal; // Free shipping
    
    summaryProduct.innerHTML = 
      '<div class="summary-item">' +
        '<div class="summary-item-image">' +
          '<div class="summary-item-placeholder"></div>' +
        '</div>' +
        '<div class="summary-item-details">' +
          '<h4>' + selectedProduct.name + '</h4>' +
          '<p>Qty: ' + selectedQuantity + '</p>' +
          '<p class="item-price">$' + selectedProduct.price + ' each</p>' +
        '</div>' +
      '</div>';
    
    summaryTotals.style.display = 'block';
    summarySubtotal.textContent = '$' + subtotal;
    summaryTotal.textContent = '$' + total;
  }

  // ========================================
  // Mini Carousel (You Might Also Like)
  // ========================================
  function renderMiniCarousel() {
    const shuffled = products.sort(function() { return 0.5 - Math.random(); });
    const recommendations = shuffled.slice(0, 6);
    
    let html = '';
    recommendations.forEach(function(product) {
      html += '<div class="mini-card" data-value="' + product.value + '">' +
                '<div class="mini-image">' +
                  '<div class="mini-image-placeholder"></div>' +
                '</div>' +
                '<h4>' + product.name + '</h4>' +
                '<p class="price">$' + product.price + '</p>' +
                '<button class="add-to-order-btn" data-value="' + product.value + '">Select</button>' +
              '</div>';
    });
    
    miniCarousel.innerHTML = html;
    
    // Add click handlers for "Select" buttons
    miniCarousel.querySelectorAll('.add-to-order-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const productValue = this.dataset.value;
        productSelect.value = productValue;
        productSelect.dispatchEvent(new Event('change'));
        
        // Scroll to form
        document.querySelector('.order-form').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // Mini carousel navigation
  miniPrev.addEventListener('click', function() {
    miniCarousel.scrollBy({ left: -140, behavior: 'smooth' });
  });

  miniNext.addEventListener('click', function() {
    miniCarousel.scrollBy({ left: 140, behavior: 'smooth' });
  });

  // ========================================
  // Form Submission
  // ========================================
  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const address = document.getElementById('address').value.trim();
    const notes = document.getElementById('notes').value.trim();
    
    // Validate
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }
    
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    // Build WhatsApp message
    const total = selectedProduct.price * selectedQuantity;
    let message = 'Hi! I would like to place an order:\n\n';
    message += '*Order Details*\n';
    message += 'Product: ' + selectedProduct.name + '\n';
    message += 'Size: ' + selectedSize + '\n';
    message += 'Quantity: ' + selectedQuantity + '\n';
    message += 'Total: $' + total + '\n\n';
    message += '*Customer Info*\n';
    message += 'Name: ' + fullName + '\n';
    message += 'Email: ' + email + '\n';
    message += 'WhatsApp: +62' + whatsapp + '\n\n';
    message += '*Delivery Address*\n';
    message += address + '\n';
    
    if (notes) {
      message += '\n *Notes*\n';
      message += notes;
    }
    
    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = 'https://wa.me/6287847582907?text=' + encodedMessage; // Replace with actual number
    
    window.open(whatsappUrl, '_blank');
  });

  // ========================================
  // Initialize
  // ========================================
  initFromParams();
  renderMiniCarousel();

});
