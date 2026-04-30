import { Cart } from "./cart.js";

const cart = new Cart();

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("plus-btn")) {
    // 장바구니 + 버튼
    cart.increase(
      Number(e.target.dataset.id),
      e.target.dataset.option,
      e.target.dataset.size
    );
  }
  // 장바구니 - 버튼
  if (e.target.classList.contains("minus-btn")) {
    cart.decrease(
      Number(e.target.dataset.id),
      e.target.dataset.option,
      e.target.dataset.size
    );
  }
  // 장바구니 삭제 버튼
  if (e.target.classList.contains("remove-btn")) {
    cart.remove(
      Number(e.target.dataset.id),
      e.target.dataset.option,
      e.target.dataset.size
    );
  }

  if (e.target.classList.contains("payment")) {
    const totalPrice = cart.getTotalPrice();

    if (totalPrice === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    if (walletAccount < totalPrice) {
      alert("잔액이 부족합니다.");
      return;
    }

    if (confirm(`총 결제 금액은 ${totalPrice}원입니다. 결제하시겠습니까?`)) {
      walletAccount -= totalPrice;
      cart.items = [];
      cart.save();
      cart.render();

      alert("결제가 완료되었습니다.");
    }
  }
});