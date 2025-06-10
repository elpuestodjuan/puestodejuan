// NAVBAR MOBILE
document.getElementById('navbarToggle').onclick = function() {
  document.getElementById('navbarMenu').classList.toggle('open');
};
const links = document.querySelectorAll('.navbar-menu a');
links.forEach(link => {
  link.addEventListener('click', function() {
    links.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    if(window.innerWidth < 950) {
      document.getElementById('navbarMenu').classList.remove('open');
    }
  });
});
// SCROLLSPY FLUIDO
const navLinks = Array.from(document.querySelectorAll('.navbar-menu a[href^="#"]'));
const sectionIds = navLinks.map(link => link.getAttribute('href').slice(1));
const sections = sectionIds.map(id => document.getElementById(id));
window.addEventListener('scroll', () => {
  let scrollPos = window.scrollY || window.pageYOffset;
  let found = false;
  for (let i = sections.length - 1; i >= 0; i--) {
    const sec = sections[i];
    if (sec && sec.offsetTop <= scrollPos + 80) {
      navLinks.forEach(l => l.classList.remove('active'));
      navLinks[i].classList.add('active');
      found = true;
      break;
    }
  }
  if (!found) navLinks.forEach(l => l.classList.remove('active'));
});
// FORM CONTACTO
document.getElementById('contactForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const form = this;
  const status = document.getElementById('contact-status');
  status.textContent = "Enviando...";
  status.style.color = "#fd9644";
  const data = new FormData(form);
  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      status.textContent = "¡Mensaje enviado! Pronto te responderemos.";
      status.style.color = "#14c97c";
      form.reset();
    } else {
      status.textContent = "Ocurrió un error. Intenta de nuevo o contáctanos por WhatsApp.";
      status.style.color = "#fe7d23";
    }
  } catch {
    status.textContent = "No se pudo enviar el mensaje. Intenta de nuevo.";
    status.style.color = "#fe7d23";
  }
});
// SCROLL SUAVE CON OFFSET NAVBAR
document.querySelectorAll('.navbar-menu a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const targetID = this.getAttribute('href').replace('#', '');
    const section = document.getElementById(targetID);
    if (section) {
      e.preventDefault();
      const offset = 72;
      const top = section.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// CARRITO FLOTANTE Y WHATSAPP
const cartBtn = document.getElementById('cart-floating-btn');
const cartPanel = document.getElementById('cart-panel');
const cartPanelClose = document.getElementById('cart-panel-close');
const cartCount = document.getElementById('cart-count');
const cartList = document.getElementById('cart-list');
const cartTotal = document.getElementById('cart-total');
const cartFinishBtn = document.getElementById('cart-finish-btn');
const cartPanelForm = document.getElementById('cart-panel-form');
const cartClientName = document.getElementById('cart-client-name');
const cartClientLocation = document.getElementById('cart-client-location');
const getLocationBtn = document.getElementById('get-location-btn');
const locationHelp = document.getElementById('location-help');
let cart = [];
function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(cart));
}
function cargarCarrito() {
  const guardado = localStorage.getItem('carrito');
  if (guardado) cart = JSON.parse(guardado);
  renderCart();
}
cartBtn.onclick = () => cartPanel.classList.toggle('open');
cartPanelClose.onclick = () => cartPanel.classList.remove('open');
function renderCart() {
  cartCount.textContent = cart.reduce((a, item) => a + item.qty, 0);
  cartList.innerHTML = cart.length ? cart.map((item, i) => `
    <div class="cart-item">
      <span class="cart-item-title">${item.title}</span>
      <div class="cart-item-controls">
        <button onclick="restarCartItem(${i})">-</button>
        <span class="cart-item-qty">${item.qty}</span>
        <button onclick="sumarCartItem(${i})">+</button>
      </div>
      <span class="cart-item-precio">$${item.price}</span>
      <span class="cart-item-subtotal" style="font-weight:600;">$${item.price * item.qty}</span>
      <span class="cart-item-remove" onclick="removeCartItem(${i})">&times;</span>
    </div>
  `).join('') : '<div style="color:#aaa;text-align:center;">Carrito vacío</div>';
  let total = cart.reduce((a, item) => a + item.qty * item.price, 0);
  cartTotal.textContent = '$' + total.toLocaleString('es-UY');
  cartPanelForm.style.display = "none";
  cartFinishBtn.style.display = cart.length ? "block" : "none";
}
window.removeCartItem = function(i) {
  cart.splice(i, 1);
  guardarCarrito();
  renderCart();
};
window.sumarCartItem = function(i) {
  let stockMax = cart[i].stock;
  if (cart[i].qty < stockMax) {
    cart[i].qty++;
    guardarCarrito();
    renderCart();
  } else {
    alert("No hay más stock disponible para este producto.");
  }
};
window.restarCartItem = function(i) {
  cart[i].qty--;
  if (cart[i].qty <= 0) {
    cart.splice(i,1);
  }
  guardarCarrito();
  renderCart();
};
window.addToCart = function(title, price, stock, sheetIdx) {
  let idx = cart.findIndex(i => i.title === title);
  if(idx >= 0) {
    if(cart[idx].qty < stock) {
      cart[idx].qty += 1;
    } else {
      alert("No hay más stock disponible para este producto.");
      return;
    }
  } else {
    if(stock > 0) {
      cart.push({title, price, qty: 1, stock, sheetIdx});
    } else {
      alert("Producto sin stock.");
      return;
    }
  }
  guardarCarrito();
  renderCart();
  // let bell = document.getElementById("bell-sound");
  // if (bell) { bell.currentTime = 0; bell.play(); }
  cartBtn.classList.add('bump');
  setTimeout(()=>cartBtn.classList.remove('bump'), 200);
};
cartFinishBtn.onclick = function() {
  if(cart.length === 0) return;
  cartPanelForm.style.display = "flex";
  cartPanelForm.scrollIntoView({behavior: "smooth", block: "center"});
  cartFinishBtn.style.display = "none";
};
getLocationBtn.onclick = function() {
  window.open("https://www.google.com/maps", "_blank");
  locationHelp.textContent = "En Google Maps, haz una pulsación larga o clic derecho sobre tu ubicación, elige '¿Qué hay aquí?', luego copia el enlace y pégalo aquí.";
  locationHelp.style.color = "#fe7d23";
};
const locationMapContainer = document.getElementById('location-map-container');
const locationMap = document.getElementById('location-map');
function showMapFromInput() {
  let val = cartClientLocation.value.trim();
  let coords = null;
  let coordRegex = /(-?\d{1,3}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/;
  let match = val.match(coordRegex);
  if (match) {
    coords = [parseFloat(match[1]), parseFloat(match[2])];
  } else if (val.includes("google.com/maps") || val.includes("maps.app.goo.gl")) {
    let url = val;
    let qMatch = url.match(/q=(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/);
    let atMatch = url.match(/@(-?\d{1,3}(?:\.\d+)?),(-?\d{1,3}(?:\.\d+)?)/);
    if (qMatch) {
      coords = [parseFloat(qMatch[1]), parseFloat(qMatch[2])];
    } else if (atMatch) {
      coords = [parseFloat(atMatch[1]), parseFloat(atMatch[2])];
    }
  }
  if (coords) {
    let [lat, lon] = coords;
    let src = `https://www.openstreetmap.org/export/embed.html?bbox=${lon-0.003},${lat-0.002},${lon+0.003},${lat+0.002}&layer=mapnik&marker=${lat},${lon}`;
    locationMap.src = src;
    locationMapContainer.style.display = "block";
  } else {
    locationMapContainer.style.display = "none";
    locationMap.src = "";
  }
}
cartClientLocation.addEventListener('input', showMapFromInput);
cartClientLocation.addEventListener('change', showMapFromInput);

cartPanelForm.onsubmit = function(e) {
  e.preventDefault();
  if(cart.length === 0) return;
  let pago = cartPanelForm.querySelector('input[name="pago"]:checked');
  let nombre = cartClientName.value.trim();
  let ubicacion = cartClientLocation.value.trim();
  if(!pago || !nombre || !ubicacion) {
    locationHelp.textContent = "Completá tu nombre y ubicación, y elegí el método de pago.";
    locationHelp.style.color = "#fe7d23";
    cartClientLocation.focus();
    return;
  }
  let saludo = `¡Hola Juan! Soy ${nombre} y te hago este pedido desde la web:\n\n`;
  let lista = cart.map(i => `• ${i.title} x${i.qty} - $${i.price * i.qty}`).join('\n');
  let total = cart.reduce((a, item) => a + item.qty * item.price, 0);
  let pagoMensaje = `\n\nMétodo de pago: ${pago.value}`;
  let ubicacionMensaje = ubicacion ? `\nUbicación: ${ubicacion}` : "";
  let mensaje = encodeURIComponent(saludo + lista + `\n\nTotal: $${total}\n` + pagoMensaje + ubicacionMensaje);
  let url = `https://api.whatsapp.com/send?phone=+59894691690&text=${mensaje}`;
  window.open(url, "_blank");
  cartPanel.classList.remove('open');
  cart = [];
  guardarCarrito();
  renderCart();
  cartPanelForm.reset();
  locationHelp.textContent = "Es obligatorio indicar tu ubicación. Haz clic en el botón naranja para abrir el mapa, selecciona tu ubicación y pega el enlace aquí.";
  locationHelp.style.color = "#14c97c";
  cartPanelForm.style.display = "none";
  locationMapContainer.style.display = "none";
  locationMap.src = "";
};
cargarCarrito();

// HERO FRASE PRINCIPAL ALTERNANTE
const frasesHero = [
  "Frutas y verduras frescas y de temporada",
  "Envío gratis a partir de $300 de compra",
  "Mas de 10 años de experiencia con la gente",
  "Seleccionamos cada producto pensando en usted",
  "Los mejores precios"
];
let idxHero = 0;
const heroTitulo = document.getElementById('heroTitulo');
setInterval(() => {
  idxHero = (idxHero + 1) % frasesHero.length;
  heroTitulo.style.opacity = 0;
  setTimeout(() => {
    heroTitulo.textContent = frasesHero[idxHero];
    heroTitulo.style.opacity = 1;
  }, 400);
}, 6000);

// Al hacer clic en el email, enfocar el campo nombre del formulario de contacto
document.getElementById('focus-nombre').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('contacto').scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(function() {
    const nombreInput = document.getElementById('nombre');
    if(nombreInput) nombreInput.focus();
  }, 600);
});