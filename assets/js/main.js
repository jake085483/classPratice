// main.js
import { Beverage } from "./beverage.js";
import { Cart } from "./cart.js";

// beverageData 배열을 돌면서 각 메뉴를 Beverage 객체로 만들고,
// 메뉴 원본 데이터에 id를 부여하고, 옵션/사이즈 정보까지 포함한 Beverage 인스턴스 배열로 변환
const beverages = beverageData.map((data, index) => {
  return new Beverage(
    index + 1,
    data.name,
    data.price,
    data.options,
    data.sizes
  );
});


const wallet = document.querySelector(".wallet-amount");
/* 지갑에 있는 금액 표시 */
wallet.textContent = walletAccount;

/* 지갑 업데이트 */
const walletWrap = document.querySelector(".wallet");
function updateWallet() {
  walletWrap.textContent = `지갑에 있는 금액: ${walletAccount}원`;
}

const cart = new Cart();

const cartCount = document.querySelector(".cart-count");

/* 장바구니에 있는 상품 수 업데이트 */
function updateCartCount() {
  if (!cartCount) return;

  const count = cart.getTotalQuantity();

  cartCount.textContent = count;
  
  /* 장바구니가 비어 있을 경우 */
  if (count === 0) {
    cartCount.classList.add("hide");
  } else {
    cartCount.classList.remove("hide");
  }

}

updateCartCount();

/* 옵션 HTML 생성 */
function createOptionHTML(options) {
  return options.map((option, index) => {
    return `
      <option value="${option}" ${index === 0 ? "selected" : ""}>
        ${option}
      </option>
    `;
  }).join("");
}

/* 사이즈 HTML 생성 */
function createSizeHTML(sizes) {
  return sizes.map((size, index) => {
    return `
      <option value="${size}" ${index === 0 ? "selected" : ""}>
        ${size}
      </option>
    `;
  }).join("");
}

const menuList = document.querySelector(".menu-list");

/* 클로저 및 return 함수 */
// sizeMap에는 사이즈별 가격, optionMap에는 옵션별 가격
function createPriceCalculator(sizeMap, optionMap) {
  // 이 반환된 함수가 나중에 실제 가격 계산
  return function (basePrice, size, option) {
    // 선택한 size에 해당하는 추가 금액 가져오기
    // 만약 없는 size 값이 들어오면 기본값으로 0 사용
    const sizePrice = sizeMap[size] ?? 0;

    // 선택한 option에 해당하는 추가 금액 가져오기
    // 만약 없는 option 값이 들어오면 기본값으로 0 사용
    const optionPrice = optionMap[option] ?? 0;

    // 기본 가격 + 사이즈 가격 + 옵션 가격
    return basePrice + sizePrice + optionPrice;
  };
}

// 여기서 클로저가 만들어짐
// getFinalPrice 함수는 sizePriceMap과 optionPriceMap을 기억
// 실제 가격 계산 함수
const getFinalPrice = createPriceCalculator(sizePriceMap, optionPriceMap);

/* 메뉴 리스트 생성 */
beverages.forEach(beverage => {
  const item = document.createElement("div");

  item.classList.add("menu-item");
  
  /* 기본 옵션과 사이즈 설정 */
  const defaultOption = beverage.options[0];
  const defaultSize = beverage.sizes[0];

  /* 초기 가격 계산 */
  const initialPrice = getFinalPrice(
    beverage.price,
    defaultSize,
    defaultOption
  );

  /* 옵션과 사이즈 HTML 생성 */
  const optionHTML = createOptionHTML(beverage.options);
  const sizeHTML = createSizeHTML(beverage.sizes);

  /* 메뉴 아이템 HTML 삽입 */
  item.insertAdjacentHTML("beforeend", 
    `
      <h3>${beverage.name}</h3>
      <p class="menu-price">${initialPrice}원</p>

      <select 
        id="option-${beverage.id}" 
        name="option" 
        class="option-select"
        ${beverage.options.length === 1 ? "disabled" : ""}
      >
        ${optionHTML}
      </select>

      <select 
        id="size-${beverage.id}" 
        name="size" 
        class="size-select"
        ${beverage.sizes.length === 1 ? "disabled" : ""}
      >
        ${sizeHTML}
      </select>

      <button class="cart-btn" data-id="${beverage.id}">담기</button>
    `
  );

  menuList.insertAdjacentElement("beforeend", item);
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("cart-btn")) {
    // 클릭한 버튼의 data-id 값을 숫자로 가져오기
    const id = Number(e.target.dataset.id);

    const menuItem = e.target.closest(".menu-item");
    const option = menuItem.querySelector(".option-select").value;
    const size = menuItem.querySelector(".size-select").value;

    // beverages 배열에서 id가 같은 상품 찾기
    const product = beverages.find(b => b.id === id);

    // 최종 가격 계산
    // 기본 가격 + 사이즈 가격 + 옵션 가격
    const finalPrice = getFinalPrice(product.price, size, option);

    // 장바구니에 넣기
    cart.add({
      id: product.id,
      name: product.name,
      price: finalPrice,
      option,
      size
    });
    updateCartCount();
  }

  
});

/* select의 선택값이 바뀌었을 때 가격 업데이트 */
document.addEventListener("change", (e) => {
  // size-select 또는 option-select가 아니면 종료
  if (!e.target.classList.contains("size-select") &&
      !e.target.classList.contains("option-select")
  ) {
    return;
  }

  const menuItem = e.target.closest(".menu-item");
  const cartBtn = menuItem.querySelector(".cart-btn");

  // 버튼에 들어있는 상품 id 가져오기
  const id = Number(cartBtn.dataset.id);

  // 위에서 만든 beverage에서 id에 맞는 상품 객체 찾기
  const product = beverages.find((b) => b.id === id);

  // 현재 선택된 사이즈 값
  const selectedSize = menuItem.querySelector(".size-select").value;

  // 현재 선택된 옵션 값
  const selectedOption = menuItem.querySelector(".option-select").value;

  // 변경된 선택값 기준으로 최종 가격 계산
  const changedPrice = getFinalPrice(
    product.price,
    selectedSize,
    selectedOption
  );

  // 메뉴 카드의 가격 표시 요소 찾기
  const priceEl = menuItem.querySelector(".menu-price");

  // 화면 가격 변경
  priceEl.textContent = `${changedPrice}원`;
});