// Global Cart State
let cart = JSON.parse(localStorage.getItem('hw_cart')) || [];

// Update Cart Badge
function updateCartBadge() {
  const cartBtns = document.querySelectorAll('.cart-btn');
  cartBtns.forEach(btn => {
    let badge = btn.querySelector('.cart-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      btn.appendChild(badge);
    }
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.opacity = '1';
    } else {
      badge.style.opacity = '0';
    }
  });
}

// Inject Cart HTML into DOM
function injectCartHTML() {
  const cartHTML = `
    <div class="cart-overlay" id="cart-overlay"></div>
    <div class="cart-drawer" id="cart-drawer">
      <div class="cart-header">
        <h3>Your Cart</h3>
        <button class="close-cart" id="close-cart">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="cart-items-container" id="cart-items">
        <!-- Items injected here -->
      </div>
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span id="cart-total-price">₹0</span>
        </div>
        <button class="btn btn-primary checkout-btn" id="go-to-checkout">Proceed to Checkout</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', cartHTML);

  // Event Listeners for Cart Toggle
  document.addEventListener('click', (e) => {
    if (e.target.closest('.cart-btn')) {
      e.preventDefault();
      openCart();
    }
  });

  document.getElementById('close-cart').addEventListener('click', closeCart);
  document.getElementById('cart-overlay').addEventListener('click', closeCart);
  
  document.getElementById('go-to-checkout').addEventListener('click', () => {
    if (cart.length > 0) {
      window.location.href = '/checkout.html';
    }
  });
}

function openCart() {
  renderCart();
  document.getElementById('cart-drawer').classList.add('active');
  document.getElementById('cart-overlay').classList.add('active');
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('active');
  document.getElementById('cart-overlay').classList.remove('active');
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total-price');
  
  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty-msg">Your cart is empty.</p>';
    totalEl.textContent = '₹0';
    return;
  }

  let html = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    html += `
      <div class="cart-item">
        <button class="cart-item-remove" data-index="${index}" title="Remove item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
        <img src="${item.img}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
          <div class="cart-item-ctrl">
            <button class="qty-btn minus" data-index="${index}">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn plus" data-index="${index}">+</button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  totalEl.textContent = '₹' + total.toLocaleString('en-IN');

  // Add listeners for QTY and Remove
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.onclick = () => removeFromCart(btn.dataset.index);
  });
  
  document.querySelectorAll('.qty-btn.plus').forEach(btn => {
    btn.onclick = () => updateQuantity(btn.dataset.index, 1);
  });
  
  document.querySelectorAll('.qty-btn.minus').forEach(btn => {
    btn.onclick = () => updateQuantity(btn.dataset.index, -1);
  });
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  updateCartBadge();
}

function updateQuantity(index, delta) {
  const i = parseInt(index);
  cart[i].quantity += delta;
  if (cart[i].quantity <= 0) {
    cart.splice(i, 1);
  }
  saveCart();
  renderCart();
  updateCartBadge();
}

function saveCart() {
  localStorage.setItem('hw_cart', JSON.stringify(cart));
}

// Add to Cart functionality
function setupAddToCart() {
  const addBtns = document.querySelectorAll('.add-cart-btn');
  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get product details from parent card
      const card = e.target.closest('.product-card');
      if(card) {
        const name = card.querySelector('.product-name').textContent;
        const priceStr = card.querySelector('.product-price').textContent;
        const price = parseFloat(priceStr.replace(/[₹,]/g, ''));
        const img = card.querySelector('.product-img').getAttribute('src');

        // Check if exists
        const existing = cart.find(i => i.name === name);
        if(existing) {
          existing.quantity += 1;
        } else {
          cart.push({ name, price, img, quantity: 1 });
        }
        
        localStorage.setItem('hw_cart', JSON.stringify(cart));
        updateCartBadge();
        openCart();
      }
    });
  });
}

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
if(navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Scroll Reveal Animations using IntersectionObserver
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.getAttribute('data-delay');
      if (delay) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
      } else {
        entry.target.classList.add('visible');
      }
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const animElements = document.querySelectorAll('.fade-up, .reveal-left, .reveal-right, .reveal-up');
animElements.forEach(el => observer.observe(el));

// 3D Tilt Effect on Product Cards
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -15; 
    const rotateY = ((x - centerX) / centerX) * 15;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    const glow = card.querySelector('.card-glow');
    if (glow) glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent 60%)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    card.style.transition = 'transform 0.5s ease';
    const glow = card.querySelector('.card-glow');
    if (glow) glow.style.background = `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent 70%)`;
  });
  
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

// Hero Parallax Effect
const heroCar = document.getElementById('hero-car');
const rings = document.querySelectorAll('.glow-ring');
if(heroCar || rings.length > 0) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY < window.innerHeight) {
      if(heroCar) {
        heroCar.style.transform = `translateX(${scrollY * 0.8}px) translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.02}deg)`;
        heroCar.style.opacity = 1 - (scrollY / 600);
      }
      rings.forEach((ring, index) => {
        const speed = (index + 1) * 0.2;
        ring.style.transform = `translate(-50%, -50%) rotateX(70deg) translateY(${scrollY * speed}px) scale(${1 + scrollY * 0.001})`;
        ring.style.opacity = 1 - (scrollY / 400);
      });
    }
  });
}

// Countdown Timer Logic
const daysEl = document.getElementById('days');
if(document.getElementById('countdown')) {
  let targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 2);
  targetDate.setHours(targetDate.getHours() + 14);
  
  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    if (diff <= 0) return;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / 1000 / 60) % 60);
    const s = Math.floor((diff / 1000) % 60);
    if(daysEl) daysEl.textContent = d < 10 ? '0'+d : d;
    document.getElementById('hours').textContent = h < 10 ? '0'+h : h;
    document.getElementById('mins').textContent = m < 10 ? '0'+m : m;
    document.getElementById('secs').textContent = s < 10 ? '0'+s : s;
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();
}

// Initialize Cart Logic globally
injectCartHTML();
updateCartBadge();
setupAddToCart();
