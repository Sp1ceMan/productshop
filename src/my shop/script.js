let cart = JSON.parse(localStorage.getItem('ecommerceCart')) || [];

function saveCart() {
  localStorage.setItem('ecommerceCart', JSON.stringify(cart));
}

function updateCartCounter() {
  const counterElement = document.querySelector('.cart-counter');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (counterElement) {

    counterElement.textContent = totalItems > 0 ? totalItems : '';
    counterElement.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

function addToCart(productName, productPrice) {
  const existingItem = cart.find(item => item.name === productName);

  if (existingItem) {
    existingItem.quantity += 1;

  } else {

    const newItem = {
      name: productName,
      price: productPrice,
      quantity: 1
    };
    cart.push(newItem);
  }

  saveCart();
  updateCartCounter();
  showToast(`Товар "${productName}" добавлен в корзину!`);
}

function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  const totalElement = document.getElementById('cart-total');

  if (!container) return;

  container.innerHTML = '';
  let overallTotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    overallTotal += itemTotal;

    const priceFormatted = `${item.price.toLocaleString()} тнг.`;
    const totalPriceFormatted = `${itemTotal.toLocaleString()} тнг.`;

    const cartItemRow = document.createElement('tr');

    cartItemRow.innerHTML = `
      <td>${item.name}</td>
      <td>${priceFormatted}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" 
        onchange="updateQuantity(${index}, this.value)">
      </td>
      <td>${totalPriceFormatted}</td> <td>
        <button onclick="removeItem(${index})" class="remove-item-btn">&times;</button>
      </td>
    `;
    container.appendChild(cartItemRow);
  });


  if (totalElement) {
    totalElement.textContent = `${overallTotal.toLocaleString()} тнг.`;
  }

  if (cart.length === 0) {
    container.innerHTML = '<tr><td colspan="5" style="text-align:center;">Ваша корзина пуста.</td></tr>';
  }
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartItems();
  updateCartCounter();
}

function updateQuantity(index, newQuantity) {
  const quantity = Number(newQuantity);
  if (quantity > 0) {
    cart[index].quantity = quantity;
    saveCart();
    renderCartItems();
    updateCartCounter();
  }
}

updateCartCounter();
if (document.getElementById('cart-items-container')) {
  renderCartItems();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCounter();

  const cartContainer = document.getElementById('cart-items-container');

  if (cartContainer) {

    renderCartItems();
  }
});

function checkout() {
  if (cart.length === 0) {
    alert("Ваша корзина пуста, нечего оформлять!");
    return;
  }

  alert("Спасибо за заказ! Мы свжемся с вами в ближайшее время.");

  cart = [];

  saveCart();

  renderCartItems();
  updateCartCounter();
}

const products = [
  {id: 1,
    name: "Черная футболка",
    price: 2500,
    category: "t-shirts",
    img: "images/t-shirt-black.jpg" },
  {id: 2,
    name: "Белая футболка",
    price: 2500,
    category: "t-shirts",
    img: "images/t-shirt-white.jpg" },
  {id: 3,
    name: "Синие джинсы",
    price: 8000,
    category: "pants",
    img: "images/jeans-blue.jpg" },
  {id: 4,
    name: "Худи Oversize",
    price: 12000,
    category: "hoodies",
    img: "images/hoodie.jpg" },
];

function displayProducts(productsArray) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = "";

  productsArray.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
    <img src="${product.img}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.price} тнг.</p>
    <button onclick="addToCart('${product.name}', ${product.price})">В корзину</button>`;

    grid.appendChild(card)
  });

  function filterProducts(category) {
    if (category === 'all') {
      displayProducts(products);
    } else {
      const filtered = products.filter(p => p.category === category);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    displayProducts(products);
  });
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 100);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}