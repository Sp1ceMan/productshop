let cart = JSON.parse(localStorage.getItem('ecommerceCart')) || [];

function saveCart() {
  localStorage.setItem('ecommerceCart', JSON.stringify(cart));
}

function updateCartCounter() {
  const counterElement = document.querySelector('.cart-counter');

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (counterElement) {

    counterElement.textContent = totalItems > 0 ? totalItems : '';
    counterElement.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

function addToCart(productName, productPrice) {
  const existingItem = cart.find(item => item.name === productName); //Проверка, есть ли такой товар или нет

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
//Поиск cart.html для вставки товаров
function renderCartItems() {
  const container = document.getElementById('cart-items-container');
  const totalElement = document.getElementById('cart-total'); //Вывод суммы

  if (!container) return;

  container.innerHTML = '';
  let overallTotal = 0;
  //Математика товара, тут я умножаю цену одного товара на его количество
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    overallTotal += itemTotal;
  //Форматирую цену в более красивые числа
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

//Отображение суммы
  if (totalElement) {
    totalElement.textContent = `${overallTotal.toLocaleString()} тнг.`;
  }
//Сообщение о пустой корзине
  if (cart.length === 0) {
    container.innerHTML = '<tr><td colspan="5" style="text-align:center;">Ваша корзина пуста.</td></tr>';
  }
}

//Удаление товара в корзине
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  renderCartItems();
  updateCartCounter();
}
//Изменение количества товара в корзине
function updateQuantity(index, newQuantity) {
  const quantity = Number(newQuantity);
  if (quantity > 0) {
    cart[index].quantity = quantity;
    saveCart();
    renderCartItems();
    updateCartCounter();
  }
}

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

// Массив данных
const products = [
  {id: 1,
    name: "Черная футболка",
    price: 10.999,
    category: "t-shirts",
    image: "myshop/images/blacktshirt.jpg" },
  {id: 2,
    name: "Белая футболка",
    price: 10.999,
    category: "t-shirts",
    image: "myshop/images/whitetshirt.jpg" },
  {id: 3,
    name: "Синие джинсы",
    price: 21.999,
    category: "pants",
    image: "myshop/images/bluejeans.jpg" },
  {id: 4,
    name: "Худи Oversize",
    price: 20.999,
    category: "hoodies",
    image: "myshop/images/hoodie.jpg" },
];

  // Фильтр для каталога
let currentCategory = 'all'

  function filterProducts(category, e) {
    currentCategory = category;

    const buttons = document.querySelectorAll('.filter-buttons button');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (e) {
      e.target.classList.add('active');
    }

    applyFilters()
  }

  //Функция Debouncing
let filterTimeout;
 function debouncedSearch() {
   clearTimeout(filterTimeout);

   filterTimeout = setTimeout(() => {
     console.log("Пользователь затих, надо запустить поиск");
     applyFilters();
   }, 1000);
 }

    //Regex фильтрация
  function applyFilters() {
    console.log("=== applyFilters ВЫЗВАНА ===");

  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('price-sort');

  const searchQuery = searchInput.value.replace(/[,.*+?^${}()|[\]\\]/g, '');
  const sortOrder = sortSelect.value;

  const regex = new RegExp(searchQuery, "i");

  let filteredProducts = products.filter(product => {
    const categoryMatches = currentCategory === 'all' || product.category === currentCategory;
    const searchMatches = searchQuery === '' || regex.test(product.name);
    return categoryMatches && searchMatches;
  });

    //Сортировка
  if (sortOrder === 'low-to-high') {
    filteredProducts.sort((a,b) => a.price - b.price);
  } else if (sortOrder === 'high-to-low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts(filteredProducts);
}

  // Уведомление о добавлении в корзину
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

// Отрисовка массива данных
function renderProducts(productArray) {

  const grid = document.getElementById('products-grid');
  if (!grid) return;

  grid.innerHTML = "";

  productArray.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
    <img src="${item.image}" alt="${item.name}">
    <h3>${item.name}</h3>
    <p>${item.price} тнг.</p>
    <button onclick="addToCart('${item.name}', ${item.price})">В корзину</button>
    `;
    grid.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCounter();

  const cartContainer = document.getElementById('cart-items-container');

  if (cartContainer) {

    renderCartItems();
  }
  const gridElement = document.getElementById('products-grid');
  if (gridElement)
  {
    renderProducts(products);
  }
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener("input", debouncedSearch);
  }
});