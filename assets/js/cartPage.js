import { Cart } from "./cart.js";

const cart = new Cart();

const couponForm = document.querySelector(".coupon-form");
const couponInput = document.querySelector(".coupon-input");
const couponMessage = document.querySelector(".coupon-message");
const couponCancelBtn = document.querySelector(".coupon-cancel-btn");

const discountPriceEl = document.querySelector(".discount-price");
const finalPriceEl = document.querySelector(".final-price");

let appliedCoupon = null;
let discountPrice = 0;
let finalPrice = cart.getTotalPrice();

/* 쿠폰 사용 횟수 가져오기 */
function getCouponUsedCount(code) {
  return Number(localStorage.getItem(`coupon_${code}_used`)) || 0;
}

/* 쿠폰 사용 횟수 증가 */
function increaseCouponUsedCount(code) {
  const currentCount = getCouponUsedCount(code);
  localStorage.setItem(`coupon_${code}_used`, currentCount + 1);
}

/* 할인 금액 계산 */
function calculateDiscount(totalPrice, coupon) {
  if (coupon.type === "percent") {
    return Math.floor(totalPrice * (coupon.value / 100));
  }

  if (coupon.type === "fixed") {
    return coupon.value;
  }

  return 0;
}

/* 결제 금액 UI 갱신 */
function updatePaymentPrice() {
  const totalPrice = cart.getTotalPrice();

  if (!appliedCoupon) {
    discountPrice = 0;
    finalPrice = totalPrice;
  } else {
    discountPrice = calculateDiscount(totalPrice, appliedCoupon);

    if (discountPrice > totalPrice) {
      discountPrice = totalPrice;
    }

    finalPrice = totalPrice - discountPrice;
  }

  discountPriceEl.textContent = `할인 금액: ${discountPrice}원`;
  finalPriceEl.textContent = `최종 결제 금액: ${finalPrice}원`;
}

updatePaymentPrice();

function applyCoupon() {
  const totalPrice = cart.getTotalPrice();

  if (totalPrice === 0) {
    appliedCoupon = null;
    couponMessage.textContent = "장바구니가 비어 있어 쿠폰을 적용할 수 없습니다.";
    couponCancelBtn.classList.add("hide");
    updatePaymentPrice();
    return;
  }

  const inputCode = couponInput.value.trim().toUpperCase();

  if (!inputCode) {
    appliedCoupon = null;
    couponMessage.textContent = "쿠폰 코드를 입력해주세요.";
    couponCancelBtn.classList.add("hide");
    updatePaymentPrice();
    return;
  }

  couponInput.addEventListener("input", () => {
    if (couponInput.value.trim().toUpperCase() !== appliedCoupon.code) {
      cancelCoupon();
    }
  });

  const coupon = couponData.find((item) => {
    return item.code === inputCode;
  });

  if (!coupon) {
    appliedCoupon = null;
    couponMessage.textContent = "존재하지 않는 쿠폰입니다.";
    couponCancelBtn.classList.add("hide");
    updatePaymentPrice();
    return;
  }

  const usedCount = getCouponUsedCount(coupon.code);

  if (usedCount >= coupon.limit) {
    appliedCoupon = null;
    couponMessage.textContent = "선착순 쿠폰이 모두 소진되었습니다.";
    couponCancelBtn.classList.add("hide");
    updatePaymentPrice();
    return;
  }

  appliedCoupon = coupon;

  couponInput.value = coupon.code;
  couponCancelBtn.classList.remove("hide");

  couponMessage.textContent = `${coupon.code} 쿠폰이 적용되었습니다. 남은 수량: ${coupon.limit - usedCount}개`;

  updatePaymentPrice();
}

function cancelCoupon(showMessage = true) {
  appliedCoupon = null;
  discountPrice = 0;
  finalPrice = cart.getTotalPrice();

  couponInput.value = "";
  couponCancelBtn.classList.add("hide");

  if (showMessage) {
    couponMessage.textContent = "쿠폰 적용이 취소되었습니다.";
  }

  updatePaymentPrice();
}

couponForm.addEventListener("submit", (e) => {
  e.preventDefault();
  applyCoupon();
});

couponCancelBtn.addEventListener("click", () => {
  cancelCoupon();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("plus-btn")) {
    cart.increase(
      Number(e.target.dataset.id),
      e.target.dataset.option,
      e.target.dataset.size
    );

    updatePaymentPrice();
  }

  if (e.target.classList.contains("minus-btn")) {
    cart.decrease(
      Number(e.target.dataset.id),
      e.target.dataset.option,
      e.target.dataset.size
    );

    updatePaymentPrice();
  }

  if (e.target.classList.contains("remove-btn")) {
    cart.remove(
      Number(e.target.dataset.id),
      e.target.dataset.option,
      e.target.dataset.size
    );

    if (cart.items.length === 0) {
      cancelCoupon(false);
      couponMessage.textContent = "장바구니가 비어 쿠폰 적용이 해제되었습니다.";
    } else {
      updatePaymentPrice();
    }
  }

  if (e.target.classList.contains("payment")) {
    const totalPrice = cart.getTotalPrice();

    if (totalPrice === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }

    if (walletAccount < finalPrice) {
      alert("잔액이 부족합니다.");
      return;
    }

    if (confirm(`총 결제 금액은 ${finalPrice}원입니다. 결제하시겠습니까?`)) {
      walletAccount -= finalPrice;

      if (appliedCoupon) {
        increaseCouponUsedCount(appliedCoupon.code);
      }

      cart.items = [];
      cart.save();
      cart.render();

      cancelCoupon(false);

      couponMessage.textContent = "";
      alert("결제가 완료되었습니다.");
    }
  }
});