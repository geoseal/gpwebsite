const checkoutBtn = document.querySelector(".checkout");
const cartBtn = document.querySelector(".cart-btn");
const modifyBtn = document.querySelector(".modify-btn");
const addBtn = document.querySelector(".add-item");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const numberInCart = document.querySelector(".number-in-cart");
const Total = document.querySelector(".total");
const cartContent = document.querySelector(".cart-content");
const amount = document.querySelector(".item-amount");
const checkoutSummary = document.querySelector(".checkout-summary");
const closeMessage = document.querySelector(".message-close");
const message = document.querySelector(".message");
const orderTotal = document.querySelector(".order-total");
const itemTotal = document.querySelector(".item-total");
const postage = document.querySelector(".postage");

let cart = [];
let add2CartButtons = [];

function add2Cart() {
  const buttons = [...document.querySelectorAll(".add-to-basket")];
  add2CartButtons = buttons;
  buttons.forEach(button => {
    let id = button.dataset.id;
    let inCart = cart.find(item => item.id === id);

    if (inCart) {
      button.innerText = "In Cart";
      button.disabled = true;
    }

    button.addEventListener("click", event => {
      event.target.innerText = "In Cart";
      event.target.disabled = true;

      let name = button.dataset.name;
      let price = button.dataset.price;
      let imageName = button.dataset.image;
      let id = button.dataset.id;
      let product = {
        id: id,
        name: name,
        price: price,
        image: imageName,
        amount: 1,
        amountid: id
      };
      cart = [...cart, product];
      Storage.saveCart(cart);
      addCartItem(product, cartContent);
      showCart();
    });
  });
}

class Storage {
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

//SHOPPING CART//
//variables

if (modifyBtn != null) {
  modifyBtn.addEventListener("click", () => {
    showCart();
  });
}

cartBtn.addEventListener("click", () => {
  showCart();
});

closeCartBtn.addEventListener("click", () => {
  hideCart();
});

cartOverlay.addEventListener("click", () => {
  hideCart();
});

function showCart() {
  cartOverlay.classList.add("transparentBackground");
  cartDOM.classList.add("showCart");
}

function hideCart() {
  cartOverlay.classList.remove("transparentBackground");
  cartDOM.classList.remove("showCart");
}

function addCartItem(item, destination) {
  const div = document.createElement("div");
  div.classList.add("cart-product");
  div.innerHTML = `
    <div class="product-image-wrapper">
      <img src="/db_images/${item.image}" alt="image of a ring" />
    </div>
    <div class="product-info-wrapper">
      <div class="product-info">
        <div>${item.name}</div>
        <div class="quantity-control">
        <span>QTY / </span>
          <span class="qty qty-sub" data-id=${item.id}>-</span>
          <span class="item-amount" data-id=${item.amountid}>${item.amount}</span>
          <span class="qty qty-add" data-id=${item.id} >+</span>
        </div>
        <div class="remove-item" data-id=${item.id}>remove</div>
      </div>
      <div class="product-price">£${item.price}</div>

    </div>
`;
  destination.appendChild(div);
  updateCart(cart);
}

function cartController() {
  cartContent.addEventListener("click", event => {
    if (event.target.classList.contains("remove-item")) {
      cartContent.removeChild(
        event.target.parentElement.parentElement.parentElement
      );
      removeItem(event.target.dataset.id);
      updateCart(cart);
    } else if (event.target.classList.contains("qty-add")) {
      let addAmount = event.target;
      let id = addAmount.dataset.id;
      let tempItem = cart.find(item => item.id === id);
      tempItem.amount += 1;
      Storage.saveCart(cart);
      addAmount.previousElementSibling.innerText = tempItem.amount;
      updateCart(cart);
    } else if (event.target.classList.contains("qty-sub")) {
      let lowerAmount = event.target;
      let id = lowerAmount.dataset.id;
      let tempItem = cart.find(item => item.id === id);

      tempItem.amount -= 1;
      if (tempItem.amount > 0) {
        Storage.saveCart(cart);
        lowerAmount.nextElementSibling.innerText = tempItem.amount;
        updateCart(cart);
      } else {
        cartContent.removeChild(
          lowerAmount.parentElement.parentElement.parentElement.parentElement
        );
        removeItem(event.target.dataset.id);
        console.log("here");
        updateCart(cart);
      }
    }
  });
}

function updateCart(cart) {
  let tempTotal = 0;
  let tempPostage = 0;
  let tempOrderTotal = 0;
  let itemsTotal = 0;

  cart.map(item => {
    tempTotal += item.price * item.amount;
    itemsTotal += item.amount;
  });

  tempTotal = parseFloat(tempTotal.toFixed(2));
  console.log(tempTotal);

  if (itemsTotal > 0) {
    tempPostage = 4.99;
  }

  tempOrderTotal = tempTotal + tempPostage;
  tempOrderTotal = parseFloat(tempOrderTotal.toFixed(2));
  Total.innerText = tempTotal;
  numberInCart.innerText = itemsTotal;

  if (modifyBtn != null) {
    itemTotal.innerText = "£ " + tempTotal;
    postage.innerText = "£ " + tempPostage;
    orderTotal.innerText = "£ " + tempOrderTotal;
  }
}

function removeItem(id) {
  cart = cart.filter(item => item.id !== id);
  Storage.saveCart(cart);
  let button = add2CartButtons.find(button => button.dataset.id === id);
  if (button != undefined) {
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i> ADD TO BASKET`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cart = Storage.getCart();
  add2Cart();
  cart.forEach(item => this.addCartItem(item, cartContent));

  cartController();
});

checkoutBtn.addEventListener("click", () => {
  cart.forEach(item => this.addCartItem(item, checkoutSummary));
});

if (closeMessage != null) {
  closeMessage.addEventListener("click", () => {
    hideMessage();
  });
}

function hideMessage() {
  message.classList.add("hide-message");
}

//CAROUSEL
var slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slides[slideIndex - 1].style.display = "block";
}
