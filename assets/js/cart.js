// Cart.js
export class Cart {
  constructor() {
    // 자바스크립트 배열/객체를 JSON 문자열로 바꿔서 localStorage로
    this.items = JSON.parse(localStorage.getItem("cartItems")) || [];
    this.render();
  }

  save() {
    // 다시 꺼내면 localStorage에서는 문자열로 나오기 때문에 다시 배열/객체로
    localStorage.setItem("cartItems", JSON.stringify(this.items));
  }

  /* 상품을 장바구니에 추가하면서 중복된 것은 숫자만 올리기 */
  add(product) {
    /* 장바구니에서 같은 상품이 있는지 찾기(id, 옵션과 사이즈가 같은지)
    find 조건에 맞는 첫번째 요소 찾기 */
    const existing = this.items.find(item => {
      return item.id === product.id && item.option === product.option && item.size === product.size;
    });

    /* 중복이 있다면 그 상품 개수 +1
    없다면 장바구니에 넣기 */
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({
        ...product,
        quantity: 1
      });
    }

    /* 로컬스토리지에 저장하고 화면 렌더 */
    this.save();
    this.render();
  }

  /* 수량 증가(+버튼) */
  increase(id, option, size) {
    // id, 옵션, 사이즈를 받아서 같은 그 상품의 수량 증가
    const item = this.items.find(item => {
      return item.id === id && item.option === option && item.size === size;
    });

    if (!item) return;

    item.quantity++;
    this.save();
    this.render();
  }

  /* 수량 감소(-버튼) */
  decrease(id, option, size) {
    // id, 옵션, 사이즈를 받아서 같은 그 상품의 수량 감소
    const item = this.items.find(item => {
      return item.id === id && item.option === option && item.size === size;
    });

    if (!item) return;

    if (item.quantity <= 1) {
      /* this.remove(id, option, size); */
      alert("1개 이하로 줄일 수 없습니다. 삭제 버튼을 이용하세요.");
      return;
    }else{
      item.quantity--;
    }

    this.save();
    this.render();
  }

  /* 장바구니에서 상품 삭제 버튼 */
  remove(id, option, size) {
    /* 상품 찾아서 그 제품을 제외한 배열을 만들어 장바구니 만들기 */
    this.items = this.items.filter(item => {
      return !(item.id === id && item.option === option && item.size === size);
    });

    this.save();
    this.render();
  }

  /* 장바구니에 담긴 전체 수량 계산 */
  getTotalQuantity() {
    return this.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  }

  /* 장바구니에 있는 물건들 총 계산 */
  getTotalPrice() {
    /* 지금까지 더해온 금액에 가격과 수량을 곱해서 더하기 */
    return this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  render() {
    const cartList = document.querySelector(".cart-list");
    const cartTotal = document.querySelector(".cart-total");

    // 현재 페이지에 장바구니 영역이 없으면 render 중단
    if (!cartList || !cartTotal) return;

    cartList.replaceChildren();

    if (this.items.length === 0) {
      cartList.insertAdjacentHTML("beforeend", "<p>장바구니가 비어 있습니다.</p>");
      cartTotal.textContent = "총 금액: 0원";
      return;
    }

    this.items.forEach(item => {
      const el = document.createElement("div");
      el.classList.add("cart-item");

      el.insertAdjacentHTML("beforeend", 
        `
          <h3>${item.name}</h3>
          <p>${item.option}</p>
          <p>${item.size}</p>
          <p>${item.price}원</p>
          <p>수량: ${item.quantity}</p>
          <button class="minus-btn" data-id="${item.id}" data-option="${item.option}" data-size="${item.size}">-</button>
          <button class="plus-btn" data-id="${item.id}" data-option="${item.option}" data-size="${item.size}">+</button>
          <button class="remove-btn" data-id="${item.id}" data-option="${item.option}" data-size="${item.size}">삭제</button>
        `
      );

      cartList.insertAdjacentElement("beforeend", el);
    });

    cartTotal.textContent = `총 금액: ${this.getTotalPrice()}원`;
  }
}