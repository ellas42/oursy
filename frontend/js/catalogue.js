// ========================================
// Catalogue Page - Search & Sort
// ========================================

document.addEventListener('DOMContentLoaded', function() {

  // DOM elements
  const catalogueGrid = document.getElementById('catalogue-grid');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const resultsCount = document.getElementById('results-count');
  const noResults = document.getElementById('no-results');
  const clearSearchBtn = document.getElementById('clear-search');

  let currentSearch = '';
  let currentSort = 'name-asc';

  
  function renderProducts(productList) {
    if (productList.length === 0) {
      catalogueGrid.style.display = 'none';
      noResults.style.display = 'block';
      resultsCount.textContent = 'No products found';
      return;
    }

    catalogueGrid.style.display = 'grid';
    noResults.style.display = 'none';
    
    if (currentSearch) {
      resultsCount.textContent = `Showing ${productList.length} product${productList.length !== 1 ? 's' : ''} for "${currentSearch}"`;
    } else {
      resultsCount.textContent = `Showing all ${productList.length} products`;
    }

    catalogueGrid.innerHTML = productList.map(function(product) {
      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            ${product.image ? `<img src="${product.image}" alt="${product.name}" />` : '<div class="image-placeholder"></div>'}
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="price" data-price-idr="${product.price}">Rp ${product.price.toLocaleString('id-ID')}</p>
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers to product cards
    catalogueGrid.querySelectorAll('.product-card').forEach(function(card) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        window.location.href = 'product.html?id=' + productId;
      });
    });

    const cards = catalogueGrid.querySelectorAll('.product-card');
    cards.forEach(function(card, index) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      
      setTimeout(function() {
        card.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 50);
    });

    if (window.updatePricesAfterRender) {
      window.updatePricesAfterRender();
    }
  }

 
  //filter n sort
  function filterAndSortProducts() {
    let filtered = products.slice();

    if (currentSearch) {
      const searchLower = currentSearch.toLowerCase();
      filtered = filtered.filter(function(product) {
        return product.name.toLowerCase().includes(searchLower);
      });
    }

    switch (currentSort) {
      case 'name-asc':
        filtered.sort(function(a, b) {
          return a.name.localeCompare(b.name);
        });
        break;
      case 'name-desc':
        filtered.sort(function(a, b) {
          return b.name.localeCompare(a.name);
        });
        break;
      case 'price-asc':
        filtered.sort(function(a, b) {
          return a.price - b.price;
        });
        break;
      case 'price-desc':
        filtered.sort(function(a, b) {
          return b.price - a.price;
        });
        break;
    }

    renderProducts(filtered);
  }

 //event listener
 //search input
  searchInput.addEventListener('input', function() {
    currentSearch = this.value.trim();
    filterAndSortProducts();
  });

  //sort select
  sortSelect.addEventListener('change', function() {
    currentSort = this.value;
    filterAndSortProducts();
  });

  // clear search button
  clearSearchBtn.addEventListener('click', function() {
    searchInput.value = '';
    currentSearch = '';
    filterAndSortProducts();
    searchInput.focus();
  });

 
  filterAndSortProducts();

});
