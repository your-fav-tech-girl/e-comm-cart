type ProductImage = string;

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const mainImg = document.getElementById("main-img") as HTMLImageElement;
  const thumbnails = document.querySelectorAll<HTMLImageElement>(".thumbnails");
  const previousBtn = document.getElementById("prev-btn") as HTMLButtonElement;
  const nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
  const decrementBtn = document.getElementById(
    "decrement"
  ) as HTMLButtonElement;
  const incrementBtn = document.getElementById(
    "increment"
  ) as HTMLButtonElement;
  const countSpan = document.getElementById("count") as HTMLSpanElement;
  const addBtn = document.getElementById("add") as HTMLButtonElement;
  const cartIcon = document.querySelector<HTMLElement>(".cart-icon");
  const cartTotalPriceElem = document.getElementById(
    "cart-total-price"
  ) as HTMLSpanElement;

  // Menu toggle elements
  const menuToggle = document.getElementById(
    "menu-toggle"
  ) as HTMLButtonElement;
  const navLinks = document.getElementById("nav-links") as HTMLElement;

  //  Menu Toggle Function 
  function toggleMenu() {
    navLinks.classList.toggle("active");
    menuToggle.classList.toggle("open"); 
  }
  menuToggle.addEventListener("click", toggleMenu);

  //  Product Data 
  const productImages: ProductImage[] = [
    "./images/image-product-1.jpg",
    "./images/image-product-2.jpg",
    "./images/image-product-3.jpg",
    "./images/image-product-4.jpg",
  ];
  const productName = "Fall Limited Edition Sneakers";
  const originalPrice = 250;
  const discountPercent = 50;
  const discountedPrice = originalPrice * (1 - discountPercent / 100);

  let currentIndex = 0;
  let cartItems: CartItem[] = [];

  //  Gallery 
  function updateMainImage(index: number) {
    mainImg.src = productImages[index];
    thumbnails.forEach((thumb, idx) =>
      thumb.classList.toggle("active-thumb", idx === index)
    );
  }

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => {
      currentIndex = index;
      updateMainImage(currentIndex);
    });
  });

  previousBtn.addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + productImages.length) % productImages.length;
    updateMainImage(currentIndex);
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % productImages.length;
    updateMainImage(currentIndex);
  });

  // Quantity Controls
  decrementBtn.addEventListener("click", () => {
    let current = parseInt(countSpan.innerText);
    if (current > 0) countSpan.innerText = (current - 1).toString();
  });

  incrementBtn.addEventListener("click", () => {
    let current = parseInt(countSpan.innerText);
    countSpan.innerText = (current + 1).toString();
  });

  // Cart Functions
  function renderCart() {
    let cartDropdown = document.getElementById(
      "cart-dropdown"
    ) as HTMLDivElement;

    if (!cartDropdown) {
      cartDropdown = document.createElement("div");
      cartDropdown.id = "cart-dropdown";
      cartDropdown.style.position = "absolute";
      cartDropdown.style.top = "50px";
      cartDropdown.style.right = "0";
      cartDropdown.style.width = "300px";
      cartDropdown.style.background = "#fff";
      cartDropdown.style.border = "1px solid #ccc";
      cartDropdown.style.padding = "10px";
      cartDropdown.style.boxShadow = "0 5px 10px rgba(0,0,0,0.2)";
      cartDropdown.style.zIndex = "1000";
      cartIcon?.appendChild(cartDropdown);
    }

    cartDropdown.innerHTML = "";

    if (cartItems.length === 0) {
      cartDropdown.innerHTML = "<p>Your cart is empty.</p>";
      cartTotalPriceElem.textContent = "$0.00";
      return;
    }

    cartDropdown.style.maxHeight = "1000px";
    cartDropdown.style.padding = "10px";

    let totalPrice = 0;

    cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;

      const itemDiv = document.createElement("div");
      itemDiv.style.display = "flex";
      itemDiv.style.alignItems = "center";
      itemDiv.style.justifyContent = "space-between";
      itemDiv.style.marginBottom = "10px";

      itemDiv.innerHTML = `
        <span>${item.name}</span>
        <button class="decrease" style="background-color:white; color: orange; border: none; width: 40px; height: 30px; cursor: pointer;">-</button>
        <span>${item.quantity}</span>
        <button class="increase" style="background-color:white; color: orange; border: none; width: 40px; height: 30px; cursor: pointer;">+</button>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
        <span class="remove" style="cursor:pointer;">🗑️</span>
      `;
      cartDropdown.appendChild(itemDiv);

      const decreaseBtn =
        itemDiv.querySelector<HTMLButtonElement>(".decrease")!;
      const increaseBtn =
        itemDiv.querySelector<HTMLButtonElement>(".increase")!;
      const removeBtn = itemDiv.querySelector<HTMLSpanElement>(".remove")!;

      decreaseBtn.addEventListener("click", () => {
        const target = cartItems.find((i) => i.id === item.id)!;
        target.quantity -= 1;
        if (target.quantity <= 0) {
          cartItems = cartItems.filter((i) => i.id !== item.id);
        }
        renderCart();
      });

      increaseBtn.addEventListener("click", () => {
        const target = cartItems.find((i) => i.id === item.id)!;
        target.quantity += 1;
        renderCart();
      });

      removeBtn.addEventListener("click", () => {
        cartItems = cartItems.filter((i) => i.id !== item.id);
        renderCart();
      });
    });

    const totalDiv = document.createElement("div");
    totalDiv.style.borderTop = "1px solid #ccc";
    totalDiv.style.paddingTop = "10px";
    totalDiv.style.textAlign = "right";
    totalDiv.innerHTML = `<strong>Total: $${totalPrice.toFixed(2)}</strong>`;
    cartDropdown.appendChild(totalDiv);

    cartTotalPriceElem.textContent = `$${totalPrice.toFixed(2)}`;
  }

  addBtn.addEventListener("click", () => {
    const qty = parseInt(countSpan.innerText);
    if (qty > 0) {
      const existingItem = cartItems.find((item) => item.id === 1);
      if (existingItem) {
        existingItem.quantity += qty;
      } else {
        cartItems.push({
          id: 1,
          name: productName,
          price: discountedPrice,
          quantity: qty,
          image: productImages[0],
        });
      }
      countSpan.innerText = "0";
      renderCart();
    }
  });

  // Lightbox 
  mainImg.addEventListener("click", () => {
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.style.position = "fixed";
    lightbox.style.top = "0";
    lightbox.style.left = "0";
    lightbox.style.width = "100%";
    lightbox.style.height = "100%";
    lightbox.style.background = "rgba(0,0,0,0.8)";
    lightbox.style.display = "flex";
    lightbox.style.alignItems = "center";
    lightbox.style.justifyContent = "center";
    lightbox.style.zIndex = "1000";

    const img = document.createElement("img");
    img.src = mainImg.src;
    img.style.maxWidth = "80%";
    img.style.maxHeight = "80%";
    img.style.borderRadius = "10px";

    lightbox.appendChild(img);
    document.body.appendChild(lightbox);

    lightbox.addEventListener("click", () => lightbox.remove());
  });
});
