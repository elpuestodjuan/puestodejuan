// URL de tu Google Sheet publicada como CSV:
const csvURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS-3gs5qzWpdvrI6kGzbqYTXKGIXZvzZdmI_gIvsbthekxpYamA-IP3NdqWgPzmLqFF5U56AN7kA80e/pub?gid=1824323229&single=true&output=csv';

fetch(csvURL)
  .then(response => response.text())
  .then(csv => {
    // Parsear CSV a objetos (primera fila = cabecera)
    const filas = csv.trim().split('\n').map(linea => linea.split(','));
    const headers = filas[0].map(h => h.trim().toLowerCase());
    const productos = filas.slice(1).map(fila => {
      let obj = {};
      fila.forEach((valor, i) => obj[headers[i]] = valor);
      return obj;
    });
    renderGaleria(productos);
  })
  .catch(err => {
    document.getElementById('galeria-productos').innerHTML = '<p>No se pudieron cargar los productos.</p>';
    console.error(err);
  });

function renderGaleria(productos) {
  const galeria = document.getElementById('galeria-productos');
  galeria.innerHTML = '';
  productos.forEach(producto => {
    if (producto.activo && producto.activo.trim().toLowerCase() !== 'sí') return;
    const card = document.createElement('div');
    card.className = 'producto-card';
    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <span class="precio">$${producto.precio}</span>
      <small class="stock">Stock: ${producto.stock}</small>
      <p class="comentarios">${producto.comentarios || ''}</p>
      <button class="agregar-btn" onclick="addToCart('${producto.nombre}', ${producto.precio}, ${producto.stock})">
        <i class="fa fa-cart-plus"></i>Agregar
      </button>
    `;
    galeria.appendChild(card);
  });
}

// Función simple de carrito (reemplaza por tu lógica real)
function addToCart(nombre, precio, stock) {
  alert(`Agregado: ${nombre} - $${precio}`);
}