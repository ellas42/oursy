document.addEventListener('DOMContentLoaded', function() {

  const productsData = typeof products !== 'undefined' ? products : [];

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

  let selectedProduct = null;
  let selectedSize = '';
  let selectedQuantity = '';


  function initFromParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');
    const size = urlParams.get('size');
    const quantity = urlParams.get('quantity');
    
    if (productId) {
      const product = productsData.find(function(p) { return p.id === parseInt(productId); });
      if (product) {
        productSelect.value = product.id;
        selectedProduct = product;
        updateStockNote(product.stock);
        
        // Set quantity from URL param if available
        if (quantity) {
          selectedQuantity = parseInt(quantity);
          quantitySelect.value = selectedQuantity;
        } else {
          selectedQuantity = 1;
          quantitySelect.value = '1';
        }
        
        if (size) {
          sizeSelect.value = size;
          selectedSize = size;
        }
        
        updateSummary();
      }
    }
  }


  
  function updateStockNote(stock) {
    if (stock >= 3) {
      stockNote.textContent = 'In Stock - ' + stock + ' available';
    } else if (stock >= 1) {
      stockNote.textContent = 'Low Stock - Only ' + stock + ' left';
    }
  }

  
  function updateSummary() {
    if (!selectedProduct) {
      summaryProduct.innerHTML = '<p class="summary-empty">Select a product to see summary</p>';
      summaryTotals.style.display = 'none';
      return;
    }
    
    const qty = parseInt(selectedQuantity) || 1;
    const subtotal = selectedProduct.price * qty;
    const total = subtotal; // Free shipping
    
    summaryProduct.innerHTML = 
      '<div class="summary-item">' +
        '<div class="summary-item-image">' +
          '<div class="summary-item-placeholder"></div>' +
        '</div>' +
        '<div class="summary-item-details">' +
          '<h4>' + selectedProduct.name + '</h4>' +
          '<p>Qty: ' + qty + '</p>' +
          '<p class="item-price">Rp' + selectedProduct.price + ' each</p>' +
        '</div>' +
      '</div>';
    
    summaryTotals.style.display = 'block';
    summarySubtotal.textContent = 'Rp' + subtotal;
    summaryTotal.textContent = 'Rp' + total;
  }


  function renderMiniCarousel() {
    const shuffled = productsData.slice().sort(function() { return 0.5 - Math.random(); });
    const recommendations = shuffled.slice(0, 6);
    
    let html = '';
    recommendations.forEach(function(product) {
      html += '<div class="mini-card" data-id="' + product.id + '">' +
                '<div class="mini-image">' +
                  '<div class="mini-image-placeholder"></div>' +
                '</div>' +
                '<h4>' + product.name + '</h4>' +
                '<p class="price">Rp' + product.price + '</p>' +
                '<button class="add-to-order-btn" data-id="' + product.id + '">Select</button>' +
              '</div>';
    });
    
    miniCarousel.innerHTML = html;
    
    miniCarousel.querySelectorAll('.add-to-order-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const productId = parseInt(this.dataset.id);
        productSelect.value = productId;
        productSelect.dispatchEvent(new Event('change'));
        
        document.querySelector('.order-form').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  miniPrev.addEventListener('click', function() {
    miniCarousel.scrollBy({ left: -140, behavior: 'smooth' });
  });

  miniNext.addEventListener('click', function() {
    miniCarousel.scrollBy({ left: 140, behavior: 'smooth' });
  });


  orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('full-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const address = document.getElementById('address').value.trim();
    const notes = document.getElementById('notes').value.trim();
    const submitButton = orderForm.querySelector('.btn-submit');
    
    if (!selectedProduct) {
      alert('Please select a product');
      return;
    }
    
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting Order...';
    
    const orderData = {
      fullName: fullName,
      email: email,
      whatsapp: whatsapp,
      product: selectedProduct.id,
      productName: selectedProduct.name,
      size: selectedSize,
      quantity: selectedQuantity,
      price: selectedProduct.price,
      address: address,
      notes: notes
    };
    
    fetch('php/order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.success) {
        alert('Order submitted successfully! Check your email for confirmation. We\'ll also contact you via WhatsApp to confirm.');
        
        orderForm.reset();
        selectedProduct = null;
        selectedSize = '';
        selectedQuantity = 1;
        updateSummary();
        stockNote.style.display = 'none';
        resetQuantityOptions();
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(function(error) {
      alert('An error occurred while submitting your order. Please try again or contact us directly at contact@oursy.shop');
    })
    .finally(function() {
      submitButton.disabled = false;
      submitButton.textContent = 'Place Order';
    });
  });

  initFromParams();
  renderMiniCarousel();

});