// ========================================
// Catalogue Page - Search & Sort
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  
  const products = [
    { id: 1, name: 'Midnight Set', price: 150000, image: 'images/bikini-blackpink1-removebg-preview.png' },
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
