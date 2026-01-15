
document.addEventListener('DOMContentLoaded', function() {
  
  const products = [
    { id: 1, name: 'Midnight Set', stock: 2, price: 150000, image: 'images/bikini-blackpink1-removebg-preview.png' },
    { id: 2, name: 'Sand Dune Set', price: 150000, image: 'images/bikini-blue1-removebg-preview.png' },
    { id: 3, name: 'Blush Wave Set', price: 150000, image: 'images/bikini-motif1-removebg-preview.png' },
    { id: 4, name: 'Sunset Glow Set', price: 150000, image: 'images/bikini-orangepurple1-removebg-preview.png' },
    { id: 5, name: 'Ocean Breeze Set', price: 150000, image: 'images/bikini-red1-removebg-preview.png' },
    { id: 6, name: 'Coral Reef Set', price: 150000, image: 'images/bikini-skyblue1-removebg-preview.png' },
    { id: 7, name: 'Sea Mist Set', price: 150000, image: 'images/bikini-white1-removebg-preview.png' },
    { id: 8, name: 'Azure Sky Set', price: 150000, image: 'images/bikini-black1-removebg-preview1.png' },
    { id: 9, name: 'Tropical Dusk Set', price: 150000, image: 'images/bikini-cherry1-removebg-preview.png' },
    { id: 10, name: 'Pearl White Set', price: 150000, image: 'images/bikini-pinkbrown1-removebg-preview.png' },
    { id: 11, name: 'Lagoon Blue Set', price: 150000, image: 'images/bikini-brown1-removebg-preview.png' },
  ];

  // Get product ID from URL (default to 1)
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1;
  const currentProduct = products.find(function(p) { return p.id === productId; }) || products[0];

  // State
  let selectedSize = 'S';
  let selectedColor = 'Black';

  // DOM Elements
  const productName = document.getElementById('product-name');
  const productPrice = document.getElementById('product-price');
  const stockInfo = document.getElementById('stock-info');
  const stockText = document.getElementById('stock-text');
  const checkoutBtn = document.getElementById('checkout-btn');
  const sizeOptions = document.getElementById('size-options');
  const colorOptions = document.getElementById('color-options');
  const selectedColorSpan = document.getElementById('selected-color');
  const thumbnailRow = document.getElementById('thumbnail-row');
  const recommendationsCarousel = document.getElementById('recommendations-carousel');
  const carouselPrev = document.getElementById('carousel-prev');
  const carouselNext = document.getElementById('carousel-next');

  // ========================================
  // Initialize Product
  // ========================================
  function initProduct() {
    // Update page title
    document.title = currentProduct.name + ' | SkyWave Bikinis';
    
    // Update product info
    productName.textContent = currentProduct.name;
    productPrice.textContent = '$' + currentProduct.price;
    
    // Update stock info
    updateStockDisplay();
    
    // Generate thumbnails
    generateThumbnails();
    
    // Update checkout link
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
    // Generate 4 thumbnail placeholders
    let html = '';
    for (let i = 0; i < 4; i++) {
      html += '<div class="thumbnail' + (i === 0 ? ' active' : '') + '" data-index="' + i + '">' +
                '<div class="thumbnail-placeholder"></div>' +
              '</div>';
    }
    thumbnailRow.innerHTML = html;
    
    // Add click handlers
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
    const params = new URLSearchParams();
    params.set('product', currentProduct.id);
    params.set('name', currentProduct.name);
    params.set('price', currentProduct.price);
    params.set('size', selectedSize);
    params.set('color', selectedColor);
    params.set('stock', currentProduct.stock);
    checkoutBtn.href = 'order.html?' + params.toString();
  }

  // ========================================
  // Size Selection
  // ========================================
  sizeOptions.addEventListener('click', function(e) {
    if (e.target.classList.contains('size-btn')) {
      sizeOptions.querySelectorAll('.size-btn').forEach(function(btn) {
        btn.classList.remove('active');
      });
      e.target.classList.add('active');
      selectedSize = e.target.dataset.size;
      updateCheckoutLink();
    }
  });

  // ========================================
  // Color Selection
  // ========================================
  colorOptions.addEventListener('click', function(e) {
    if (e.target.classList.contains('color-btn')) {
      colorOptions.querySelectorAll('.color-btn').forEach(function(btn) {
        btn.classList.remove('active');
      });
      e.target.classList.add('active');
      selectedColor = e.target.dataset.color;
      selectedColorSpan.textContent = selectedColor;
      updateCheckoutLink();
    }
  });

  // ========================================
  // Accordion
  // ========================================
  document.querySelectorAll('.accordion-header').forEach(function(header) {
    header.addEventListener('click', function() {
      const item = this.parentElement;
      item.classList.toggle('active');
    });
  });

  // ========================================
  // Recommendations Carousel
  // ========================================
  function renderRecommendations() {
    // Get random products excluding current
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
    
    // Add click handlers
    recommendationsCarousel.querySelectorAll('.recommendation-card').forEach(function(card) {
      card.addEventListener('click', function() {
        window.location.href = 'product.html?id=' + this.dataset.id;
      });
    });
  }

  // Carousel navigation
  carouselPrev.addEventListener('click', function() {
    recommendationsCarousel.scrollBy({ left: -240, behavior: 'smooth' });
  });

  carouselNext.addEventListener('click', function() {
    recommendationsCarousel.scrollBy({ left: 240, behavior: 'smooth' });
  });

  // ========================================
  // Initialize
  // ========================================
  initProduct();
  renderRecommendations();

});
