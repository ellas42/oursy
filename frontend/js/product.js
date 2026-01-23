
document.addEventListener('DOMContentLoaded', function() {
  
  
const products = [
  { id: 1, name: 'Sport Kini', 
    stock: 1, 
    price: 149999, 
    image: 'frontend/images/bikini-blackpink1-removebg-preview.png',
    sizes: ['M'],
    colors: [{name: 'Black', hex: '#1a1513' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 2, name: 'Midnight Blue', 
    stock: 4, 
    price: 169999, 
    image: 'frontend/images/bikini-blue1-removebg-preview.png',
    sizes: ['S', 'M', 'L'],
    colors: [{name: 'Blue', hex: '#06275f' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 3, name: 'Wood Land', 
    stock: 2, 
    price: 129999, 
    image: 'frontend/images/bikini-motif1-removebg-preview.png',
    sizes: ['L'],
    colors: [{name: 'Motif', hex: '#a67c52' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']  
  },

  { id: 4, name: 'Sunset Glow', 
    stock: 2, 
    price: 129999, 
    image: 'frontend/images/bikini-orangepurple1-removebg-preview.png',
    sizes: ['M'],
    colors: [{name: 'Orange Purple', hex: '#d9744c' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 5, name: 'Hearts of Ours', 
    stock: 3, 
    price: 169999, 
    image: 'frontend/images/bikini-red1-removebg-preview.png',
    sizes: ['S'],
    colors: [{name: 'Red', hex: '#b11226' }, {name: 'Pink', hex: '#e75480' }, {name: 'White', hex: '#ffffff' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 6, name: 'Coral Reef Set', 
    stock: 2, 
    price: 149999, 
    image: 'frontend/images/bikini-skyblue1-removebg-preview.png',
    sizes: ['M'],
    colors: [{name: 'Sky Blue', hex: '#5bc0de' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 7, name: 'Cherry Love Set', 
    stock: 1, 
    price: 129999, 
    image: 'frontend/images/bikini-cherry1-removebg-preview.png',
    sizes: ['S'],
    colors: [{name: 'White with Cherry Motifs', hex: '#ff4d6d' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },

  { id: 8, name: 'Lagoon Blue Set', 
    stock: 1, 
    price: 139999, 
    image: 'frontend/images/bikini-brown1-removebg-preview.png',
    sizes: ['S'],
    colors: [{name: 'Brown with White Straps', hex: '#6f4e37' }],
    details: ['80% Polyamide, 20% Elastane', 'Adjustable straps', 'Removable padding'],
    care: ['Hand wash in cold water', 'Do not bleach', 'Lay flat to dry'],
    shipping: ['Free delivery within Bali', '2-3 business days delivery']
  },
];


  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1;
  const currentProduct = products.find(function(p) { return p.id === productId; }) || products[0];

  let selectedSize = '';
  let selectedColor = '';

  const productName = document.getElementById('product-name');
  const productPrice = document.getElementById('product-price');
  const productTotalPrice = document.getElementById('product-total-price');
  const productQuantity = document.getElementById('stock-quantity');
  const stockInfo = document.getElementById('stock-info');
  const stockText = document.getElementById('stock-text');
  const checkoutBtn = document.getElementById('checkout-btn');
  const sizeOptions = document.getElementById('size-options');
  const colorOptions = document.getElementById('color-options');
  const selectedColorSpan = document.getElementById('selected-color');
  const quantityStepper = document.getElementById('quantity-stepper');
  const qtyInput = document.getElementById('qty-input');
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const thumbnailRow = document.getElementById('thumbnail-row');
  const recommendationsCarousel = document.getElementById('recommendations-carousel');
  const carouselPrev = document.getElementById('carousel-prev');
  const carouselNext = document.getElementById('carousel-next');

  let selectedQuantity = 1;

  function renderSizes() {
    const sizeHTML = currentProduct.sizes.map(function(size) {
      return '<button class="size-btn" data-size="' + size + '">' + size + '</button>';
    }).join('');
    sizeOptions.innerHTML = sizeHTML;

    attachSizeListeners();
  }

  function renderColors() {
    const colorHTML = currentProduct.colors.map(function(color) {
      return '<button class="color-btn" data-color="' + color.name + '" style="background-color: ' + color.hex + ';" title="' + color.name + '"></button>';
    }).join('');
    colorOptions.innerHTML = colorHTML;

    attachColorListeners();
  }

  function attachSizeListeners() {
    sizeOptions.querySelectorAll('.size-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        sizeOptions.querySelectorAll('.size-btn').forEach(function(b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
        selectedSize = this.dataset.size;
        updateCheckoutLink();
      });
    });
  }

  function attachColorListeners() {
    colorOptions.querySelectorAll('.color-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        colorOptions.querySelectorAll('.color-btn').forEach(function(b) {
          b.classList.remove('active');
        });
        this.classList.add('active');
        selectedColor = this.dataset.color;
        selectedColorSpan.textContent = selectedColor;
        updateCheckoutLink();
      });
    });
  }

  function renderQuantity() {
    const maxQuantity = Math.min(currentProduct.stock, 5);
    selectedQuantity = 1;
    qtyInput.value = 1;
    updateQuantityButtons();
    attachQuantityListeners();
  }

  function updateQuantityButtons() {
    const maxQuantity = Math.min(currentProduct.stock, 5);
    
    // Disable minus if quantity is 1 or stock is 1
    if (selectedQuantity <= 1 || currentProduct.stock === 1) {
      qtyMinus.disabled = true;
    } else {
      qtyMinus.disabled = false;
    }
    
    // Disable plus if quantity reaches max stock
    if (selectedQuantity >= maxQuantity || currentProduct.stock === 1) {
      qtyPlus.disabled = true;
    } else {
      qtyPlus.disabled = false;
    }
    
    // Disable both if only 1 stock
    if (currentProduct.stock === 1) {
      qtyMinus.disabled = true;
      qtyPlus.disabled = true;
    }
    
    updateTotalPrice();
  }

  function attachQuantityListeners() {
    const maxQuantity = Math.min(currentProduct.stock, 5);
    
    qtyMinus.addEventListener('click', function() {
      if (selectedQuantity > 1) {
        selectedQuantity--;
        qtyInput.value = selectedQuantity;
        updateQuantityButtons();
        updateCheckoutLink();
      }
    });
    
    qtyPlus.addEventListener('click', function() {
      if (selectedQuantity < maxQuantity && currentProduct.stock > 1) {
        selectedQuantity++;
        qtyInput.value = selectedQuantity;
        updateQuantityButtons();
        updateCheckoutLink();
      }
    });
  }

  function updateTotalPrice() {
    const totalPrice = currentProduct.price * selectedQuantity;
    productTotalPrice.textContent = 'Total: Rp' + totalPrice;
  }

  function renderDetails() {
    const detailsHTML = '<ul>' + currentProduct.details.map(function(detail) {
      return '<li>' + detail + '</li>';
    }).join('') + '</ul>';
    document.querySelector('.accordion-item:nth-child(1) .accordion-content').innerHTML = detailsHTML;
  }

  function initProduct() {
    document.title = currentProduct.name + ' | Oursy';
    
    productName.textContent = currentProduct.name;
    productPrice.textContent = 'Rp' + currentProduct.price;
    
    renderSizes();
    renderColors();
    renderQuantity();
    renderDetails();
    
    updateStockDisplay();
    
    generateThumbnails();
    
    checkoutBtn.disabled = true;
    checkoutBtn.title = 'Please select a size and color';
    
    updateCheckoutLink();
  }

  function updateStockDisplay() {
    const stock = currentProduct.stock;
    if (stock >= 3) {
      stockInfo.className = 'stock-info';
      stockText.textContent = 'In Stock - ' + stock + ' available';
    } else if (stock >= 1) {
      stockInfo.className = 'stock-info low';
      stockText.textContent = 'Low Stock - Only ' + stock + ' left';
    } else {
      stockInfo.className = 'stock-info out';
      stockText.textContent = 'Out of Stock';
    }
  }

  function generateThumbnails() {
    const mainImage = document.getElementById('main-image');
    const imgTag = '<img src="' + currentProduct.image + '" alt="' + currentProduct.name + '">';
    mainImage.innerHTML = imgTag;
    
    let html = '';
    for (let i = 0; i < 4; i++) {
      html += '<div class="thumbnail' + (i === 0 ? ' active' : '') + '" data-index="' + i + '">' +
                '<img src="' + currentProduct.image + '" alt="' + currentProduct.name + ' view ' + (i + 1) + '">' +
              '</div>';
    }
    thumbnailRow.innerHTML = html;
    
    thumbnailRow.querySelectorAll('.thumbnail').forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        thumbnailRow.querySelectorAll('.thumbnail').forEach(function(t) {
          t.classList.remove('active');
        });
        this.classList.add('active');
      });
    });
  }

  function updateCheckoutLink() {
    if (!selectedSize || !selectedColor) {
      checkoutBtn.disabled = true;
      checkoutBtn.title = 'Please select a size and color';
      return;
    }
    
    checkoutBtn.disabled = false;
    checkoutBtn.title = '';
    
    const params = new URLSearchParams();
    params.set('product', currentProduct.id);
    params.set('name', currentProduct.name);
    params.set('price', currentProduct.price);
    params.set('size', selectedSize);
    params.set('color', selectedColor);
    params.set('quantity', selectedQuantity);
    params.set('stock', currentProduct.stock);
    checkoutBtn.href = 'order.html?' + params.toString();
  }


  // Prevent checkout if size/color not selected
  checkoutBtn.addEventListener('click', function(e) {
    if (!selectedSize || !selectedColor) {
      e.preventDefault();
      alert('Please select both a size and a color before checkout');
    }
  });

  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      const item = this.parentElement;
      item.classList.toggle('active');
    });
  });

  function renderRecommendations() {
    const otherProducts = products.filter(function(p) { return p.id !== currentProduct.id; });
    const shuffled = otherProducts.sort(function() { return 0.5 - Math.random(); });
    const recommendations = shuffled.slice(0, 6);
    
    let html = '';
    recommendations.forEach(function(product) {
      html += '<div class="recommendation-card" data-id="' + product.id + '">' +
                '<div class="product-image">' +
                  '<div class="image-placeholder"></div>' +
                '</div>' +
                '<div class="product-info">' +
                  '<h4>' + product.name + '</h4>' +
                  '<p class="price">$' + product.price + '</p>' +
                '</div>' +
              '</div>';
    });
    
    recommendationsCarousel.innerHTML = html;
    
    recommendationsCarousel.querySelectorAll('.recommendation-card').forEach(function(card) {
      card.addEventListener('click', function() {
        window.location.href = 'product.html?id=' + this.dataset.id;
      });
    });
  }

  carouselPrev.addEventListener('click', function() {
    recommendationsCarousel.scrollBy({ left: -240, behavior: 'smooth' });
  });

  carouselNext.addEventListener('click', function() {
    recommendationsCarousel.scrollBy({ left: 240, behavior: 'smooth' });
  });

  initProduct();
  renderRecommendations();

});