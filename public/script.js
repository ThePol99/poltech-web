const PRODUCTS = [
  { id: 1, name: 'Laptop Pro 15"', category: 'computadores', price: 899, specs: 'AMD Ryzen 7 · 16GB RAM · 512GB NVMe', gradient: 'linear-gradient(135deg,#0d2545,#1a4a8a)', icon: '💻' },
  { id: 2, name: 'PC Gaming Tower', category: 'computadores', price: 1499, specs: 'Intel i7-13700 · RTX 4060 · 32GB · 1TB', gradient: 'linear-gradient(135deg,#150d2a,#3d1a7a)', icon: '🖥️' },
  { id: 3, name: 'Ultrabook Slim 13"', category: 'computadores', price: 599, specs: 'Intel Core i5 · 8GB RAM · 256GB SSD', gradient: 'linear-gradient(135deg,#0a2218,#1a5c3a)', icon: '💻' },
  { id: 4, name: 'Mouse Gaming Pro', category: 'perifericos', price: 49, specs: 'RGB · 12000 DPI · Inalámbrico · 70h', gradient: 'linear-gradient(135deg,#2a0d0d,#6b1818)', icon: '🖱️' },
  { id: 5, name: 'Teclado Mecánico RGB', category: 'perifericos', price: 89, specs: 'Switch Blue · RGB · Anti-ghosting · TKL', gradient: 'linear-gradient(135deg,#0d2a10,#1a5c20)', icon: '⌨️' },
  { id: 6, name: 'Audífonos Surround 7.1', category: 'perifericos', price: 79, specs: 'Virtual 7.1 · Micrófono retráctil · USB-C', gradient: 'linear-gradient(135deg,#2a1a0d,#5c3a10)', icon: '🎧' },
  { id: 7, name: 'Monitor 27" 4K 144Hz', category: 'perifericos', price: 449, specs: '4K UHD · 144Hz · IPS · HDR400 · 1ms', gradient: 'linear-gradient(135deg,#0d1a3a,#1a3a6b)', icon: '🖥️' },
  { id: 8, name: 'Webcam HD Pro 1080p', category: 'perifericos', price: 39, specs: '1080p 60fps · Micrófono dual · Autofocus', gradient: 'linear-gradient(135deg,#2a0d2a,#5c1a5c)', icon: '📷' },
];

let cart = [];
let currentFilter = 'todos';

function renderProducts(filter = 'todos') {
  const grid = document.getElementById('products-grid');
  const filtered = filter === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" id="card-${p.id}">
      <div class="product-img" style="background:${p.gradient}">${p.icon}</div>
      <div class="product-body">
        <div class="product-category">${p.category}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-specs">${p.specs}</div>
        <div class="product-footer">
          <div class="product-price">$${p.price.toLocaleString()} <span>USD</span></div>
          <button class="add-btn" onclick="addToCart(${p.id})">+ Agregar</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts(filter);
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) return removeFromCart(id);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

function updateCart() {
  const badge = document.getElementById('cart-badge');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  badge.textContent = totalQty;

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="cart-empty"><p>🛒</p><p>Tu carrito está vacío</p></div>`;
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-icon">${item.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${(item.price * item.qty).toLocaleString()}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
      </div>
    `).join('');
  }

  totalEl.textContent = totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 });
  updateFormSummary();
  updateMailtoLink();
}

function updateMailtoLink() {
  const link = document.getElementById('mailto-link');
  if (!link) return;
  const email = 'e1751203728@uisrael.edu.ec';
  const subject = 'Consulta de productos - Poltech';
  let body;
  if (cart.length === 0) {
    body = 'Hola equipo Poltech,\n\nEstoy interesado en sus productos.\n\nNombre: \nTeléfono: ';
  } else {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const items = cart.map(i => `- ${i.icon} ${i.name} x${i.qty} = $${(i.price * i.qty).toLocaleString()}`).join('\n');
    body = `Hola equipo Poltech,\n\nMe interesan los siguientes productos:\n\n${items}\n\nTotal estimado: $${total.toLocaleString()}\n\nPor favor contáctenme con más información.\n\nNombre: \nTeléfono: `;
  }
  link.href = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  link.target = '_blank';
}

function updateFormSummary() {
  const el = document.getElementById('cart-form-summary');
  if (cart.length === 0) {
    el.classList.remove('visible');
    return;
  }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  el.classList.add('visible');
  el.innerHTML = `
    <h4>🛒 Productos seleccionados</h4>
    ${cart.map(i => `<div style="display:flex;justify-content:space-between;margin-bottom:4px"><span>${i.icon} ${i.name} ×${i.qty}</span><span>$${(i.price * i.qty).toLocaleString()}</span></div>`).join('')}
    <div style="border-top:1px solid #1a1a30;margin-top:8px;padding-top:8px;font-weight:700;display:flex;justify-content:space-between"><span>Total</span><span style="color:#4f9eff">$${total.toLocaleString()}</span></div>
  `;
}

function toggleCart() {
  document.getElementById('cart-sidebar').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
}

function goToContact() {
  toggleCart();
  setTimeout(() => {
    document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

async function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const status = document.getElementById('form-status');

  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  const cartItems = cart.map(i => `${i.name} x${i.qty} ($${i.price * i.qty})`).join(', ');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  try {
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, telefono, mensaje, cartItems, total, canal: 'Formulario Web' }),
    });

    status.textContent = '✅ ¡Mensaje enviado! Te contactaremos pronto.';
    status.className = 'form-status success';
    e.target.reset();
    cart = [];
    updateCart();
  } catch {
    status.textContent = '❌ Error al enviar. Intenta de nuevo.';
    status.className = 'form-status error';
  } finally {
    btn.textContent = 'Enviar consulta →';
    btn.disabled = false;
  }
}

renderProducts();
