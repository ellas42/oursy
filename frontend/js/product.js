let currentProduct = null;
let selectedSize = '';
let selectedColor = '';
let selectedQuantity = 1;
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', function() {


  //dont know what it is but do NOT touch. it works somehow
  const productPageRoot = document.getElementById('product-name');

  if (!productPageRoot)
    return;

  
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'), 10);

   if (!Number.isInteger(productId)) return;


  if (!productId) {
    alert('Product not found');
    window.location.href = 'catalogue.html';
    return;
  }

currentProduct = products.find(p => p.id === productId);

  if (!currentProduct) {
    alert('Product not found');
    window.location.href = 'catalogue.html';
    return;
  }



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
  const mainImage = document.getElementById('main-image');
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
    
    if (selectedQuantity <= 1 || currentProduct.stock === 1) {
      qtyMinus.disabled = true;
    } else {
      qtyMinus.disabled = false;
    }
    
    if (selectedQuantity >= maxQuantity || currentProduct.stock === 1) {
      qtyPlus.disabled = true;
    } else {
      qtyPlus.disabled = false;
    }
    
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
////////////////////////////////////////////////
  //put on checkout button [CHECKOUT -- {total}]
  function updateTotalPrice() {
    const totalPrice = currentProduct.price * selectedQuantity;
    productTotalPrice.textContent = 'Total: Rp' + totalPrice.toLocaleString('id-ID');
  }
  ///////////////////////////////////////////////////

  function renderDetails() {
    const detailsHTML = '<ul>' + currentProduct.details.map(function(detail) {
      return '<li>' + detail + '</li>';
    }).join('') + '</ul>';
    document.querySelector('.accordion-item:nth-child(1) .accordion-content').innerHTML = detailsHTML;
  }

  function initProduct() {
    document.title = currentProduct.name + ' | Oursy';
    
    productName.textContent = currentProduct.name;
    productPrice.textContent = 'Rp' + currentProduct.price.toLocaleString('id-ID');
    
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

  function updateMainImage(index) {
    currentImageIndex = index;
    const imgTag = '<img src="' + currentProduct.images[index] + '" alt="' + currentProduct.name + '">';
    mainImage.innerHTML = imgTag;
  }

  function generateThumbnails() {
    // Show first image in main display
    updateMainImage(0);
    
    // Generate thumbnails based on available images
    let html = '';
    currentProduct.images.forEach(function(imagePath, index) {
      html += '<div class="thumbnail' + (index === 0 ? ' active' : '') + '" data-index="' + index + '">' +
                '<img src="' + imagePath + '" alt="' + currentProduct.name + ' view ' + (index + 1) + '">' +
              '</div>';
    });
    
    thumbnailRow.innerHTML = html;
    
    // Add click listeners to thumbnails
    thumbnailRow.querySelectorAll('.thumbnail').forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        const index = parseInt(this.getAttribute('data-index'));
        
        // Remove active class from all thumbnails
        thumbnailRow.querySelectorAll('.thumbnail').forEach(function(t) {
          t.classList.remove('active');
        });
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Update main image
        updateMainImage(index);
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
                  '<img src="' + product.images[0] + '" alt="' + product.name + '">' +
                '</div>' +
                '<div class="product-info">' +
                  '<h4>' + product.name + '</h4>' +
                  '<p class="price">Rp' + product.price.toLocaleString('id-ID') + '</p>' +
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


  const addToCartBtn = document.getElementById('addToCartBtn');

  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
    

if (!currentProduct) {
  alert('Product not found');
  window.location.href = 'catalogue.html';
  return;
}

      const sizeOptions = document.querySelectorAll('.size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
      sizeOptions.forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

if (!selectedSize) {
  alert('Please select a size');
  return;
}

if (!selectedColor) {
  alert('Please select a color');
  return;
}


      
      
      addToCart({
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity: selectedQuantity
      });
      
    });
  }
  

