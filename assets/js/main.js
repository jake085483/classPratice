// main.js
import { Beverage } from "./beverage.js";
import { Cart } from "./cart.js";

// beverageData 배열을 돌면서 각 메뉴를 Beverage 객체로 만들고,
// index + 1을 id로 사용해서 1, 2, 3... 형태의 고유 id를 부여
const beverages = beverageData.map((data, index) => {
  return new Beverage(index + 1, data.name, data.price);
});

const wallet = document.querySelector(".wallet-amount");
wallet.textContent = walletAccount;

const walletWrap = document.querySelector(".wallet");
function updateWallet() {
  walletWrap.textContent = `지갑에 있는 금액: ${walletAccount}원`;
}


const cart = new Cart();

const cartCount = document.querySelector(".cart-count");

function updateCartCount() {
  if (!cartCount) return;

  const count = cart.getTotalQuantity();

  cartCount.textContent = count;

  if (count === 0) {
    cartCount.classList.add("hide");
  } else {
    cartCount.classList.remove("hide");
  }

}

updateCartCount();

const menuList = document.querySelector(".menu-list");

beverages.forEach(beverage => {
  const item = document.createElement("div");

  item.classList.add("menu-item");

  item.insertAdjacentHTML("beforeend", 
    `
      <h3>${beverage.name}</h3>
      <p class="menu-price">${beverage.price}원</p>

      <select id="option-${beverage.id}" name="option" class="option-select">
        <option value="HOT" selected>HOT</option>
        <option value="ICE">ICE</option>
      </select>

      <select id="size-${beverage.id}" name="size" class="size-select">
        <option value="small">small</option>
        <option value="regular" selected>regular</option>
        <option value="large">large</option>
      </select>

      <button class="cart-btn" data-id="${beverage.id}">담기</button>
    `
  );

  menuList.insertAdjacentElement("beforeend", item);
});

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

