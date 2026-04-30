import { Cart } from "./cart.js";

const cart = new Cart();

const couponForm = document.querySelector(".coupon-form");
const couponInput = document.querySelector(".coupon-input");
const couponMessage = document.querySelector(".coupon-message");
const couponCancelBtn = document.querySelector(".coupon-cancel-btn");

const discountPriceEl = document.querySelector(".discount-price");
const finalPriceEl = document.querySelector(".final-price");

/* 현재 적용된 쿠폰 정보 */
let appliedCoupon = null;
/* 할인 금액 */
let discountPrice = 0;
/* 최종 결제 금액 */
let finalPrice = cart.getTotalPrice();

/* 쿠폰 사용 횟수 가져오기 */
function getCouponUsedCount(code) {
  return Number(localStorage.getItem(`coupon_${code}_used`));
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

  /* 적용된 쿠폰이 없을 경우 */
  if (!appliedCoupon) {
    discountPrice = 0;
    finalPrice = totalPrice;
  } else {/* 적용된 쿠폰이 있을 경우 계산 */
    discountPrice = calculateDiscount(totalPrice, appliedCoupon);

    /* 할인 금액이 총 금액을 초과할 경우 */
    if (discountPrice > totalPrice) {
      discountPrice = totalPrice;
    }

    finalPrice = totalPrice - discountPrice;
  }
  /* UI 업데이트 */
  discountPriceEl.textContent = `할인 금액: ${discountPrice}원`;
  finalPriceEl.textContent = `최종 결제 금액: ${finalPrice}원`;
}

/* 결제 금액 UI 초기화 */
updatePaymentPrice();

/* 쿠폰 적용 */
function applyCoupon() {
  /* 총 금액 가져오기 */
  const totalPrice = cart.getTotalPrice();
  const inputCode = couponInput.value.trim().toLowerCase();

  /* 장바구니가 비어 있을 경우 */
  if (totalPrice === 0) {
    appliedCoupon = null;
    couponMessage.textContent = "장바구니가 비어 있어 쿠폰을 적용할 수 없습니다.";
    couponCancelBtn.classList.add("hide");
    updatePaymentPrice();
    return;
  }

  /* 입력된 쿠폰 코드가 없을 경우 */
  if (!inputCode) { 
    appliedCoupon = null;
    couponMessage.textContent = "쿠폰 코드를 입력해주세요.";
    couponCancelBtn.classList.add("hide");
    updatePaymentPrice();
    return;
  }

  // 입력한 쿠폰 코드와 일치하는 쿠폰 찾기
  const coupon = couponData.find((item) => {
    return item.code.toLowerCase() === inputCode;
  });

  // 쿠폰 번호가 couponData에 없는 경우
  if (!coupon) {
    appliedCoupon = null;
    couponMessage.textContent = "유효하지 않은 쿠폰입니다.";
    couponCancelBtn.classList.add("hide");
    updatePaymentPrice();
    return;
  }

  const usedCount = getCouponUsedCount(coupon.code);

  /* 쿠폰 사용 횟수가 한도에 도달했을 경우 */
  if (usedCount >= coupon.limit) {
    appliedCoupon = null;
    couponMessage.textContent = "해당 쿠폰이 모두 소진되었습니다.";
    couponCancelBtn.classList.add("hide");
    updatePaymentPrice();
    return;
  }

  /* 쿠폰 적용 */
  appliedCoupon = coupon;

  /* 쿠폰 코드 입력 */
  couponInput.value = coupon.code;
  couponCancelBtn.classList.remove("hide");

  /* 쿠폰 적용 메시지 표시 */
  couponMessage.textContent = `쿠폰이 적용되었습니다.`;
  /* couponMessage.textContent = `${coupon.code} 쿠폰이 적용되었습니다. 남은 수량: ${coupon.limit - usedCount}개`; */

  updatePaymentPrice();
}

/* 쿠폰 적용 취소(input value까지 한번에 지우기) */
function cancelAllCoupon(showMessage = true) {
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
/* 쿠폰 적용 취소(input value에서 하나씩 지울 때) */
function cancelCoupon(showMessage = true) {
  appliedCoupon = null;
  discountPrice = 0;
  finalPrice = cart.getTotalPrice();

  couponCancelBtn.classList.add("hide");

  if (showMessage) {
    couponMessage.textContent = "쿠폰 적용이 취소되었습니다.";
  }

  updatePaymentPrice();
}

/* 쿠폰 폼 제출 이벤트 */
couponForm.addEventListener("submit", (e) => {
  e.preventDefault();
  applyCoupon();
});

/* 쿠폰 취소 버튼 이벤트 */
couponCancelBtn.addEventListener("click", () => {
  cancelAllCoupon();
});

/* 장바구니 아이템 클릭 이벤트 */
document.addEventListener("click", (e) => {
  /* 더하기 버튼 */
  if (e.target.classList.contains("plus-btn")) {
    cart.increase(
      Number(e.target.dataset.id),
      e.target.dataset.option,
      e.target.dataset.size
    );

    updatePaymentPrice();
  }
  /* 빼기 버튼 */
  if (e.target.classList.contains("minus-btn")) {
    cart.decrease(
      Number(e.target.dataset.id),
      e.target.dataset.option,
      e.target.dataset.size
    );

    updatePaymentPrice();
  }

  /* 삭제 버튼 */
  if (e.target.classList.contains("remove-btn")) {
    cart.remove(
      Number(e.target.dataset.id),
      e.target.dataset.option,
      e.target.dataset.size
    );

    if (cart.items.length === 0) {
      cancelAllCoupon(false);
      couponMessage.textContent = "장바구니가 비어 쿠폰 적용이 해제되었습니다.";
    } else {
      updatePaymentPrice();
    }
  }

  /* 결제 버튼 */
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

    /* 결제 확인 */
    if (confirm(`총 결제 금액은 ${finalPrice}원입니다. 결제하시겠습니까?`)) {
      // 지갑 금액 차감
      walletAccount -= finalPrice;

      // 변경된 지갑 금액을 localStorage에 저장
      saveWalletAccount();

      // 쿠폰이 적용되어 있으면 쿠폰 사용 횟수 증가
      if (appliedCoupon) {
        increaseCouponUsedCount(appliedCoupon.code);
      }

      // 장바구니 비우기
      cart.items = [];
      cart.save();
      cart.render();

      couponInput.value = "";

      // 쿠폰 상태 초기화
      cancelCoupon(false);

      couponMessage.textContent = "";
      alert("결제가 완료되었습니다.");
    }
  }
});