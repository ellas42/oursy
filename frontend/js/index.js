
document.addEventListener('DOMContentLoaded', function() {

  const navbar = document.getElementById('navbar');
  
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  
  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); 

  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', function(event) {
      if (!navbar.contains(event.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }


  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

 
  function renderCataloguePreview() {
    if (window.location.pathname.includes('catalogue')) return;
    
    const catalogueGrid = document.getElementById('catalogue-grid');
    
    if (!catalogueGrid) return;
    
    const previewProducts = products.slice(0, 4);
    
    catalogueGrid.innerHTML = previewProducts.map(function(product) {
      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="price" data-price-idr="${product.price}">Rp ${product.price.toLocaleString('id-ID')}</p>
          </div>
        </div>
      `;
    }).join('');

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
  }

  renderCataloguePreview();


  const animatedElements = document.querySelectorAll('.feature-card, .product-card, .section-header');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, index) {
      if (entry.isIntersecting) {
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, index * 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatedElements.forEach(function(element) {
    element.classList.add('fade-in');
    observer.observe(element);
  });


  const productCards = document.querySelectorAll('.product-card');
  
  productCards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

});
