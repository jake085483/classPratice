// 메뉴 및 가격
const beverageData = [
  { name: "아메리카노", price: 3000 },
  { name: "카푸치노", price: 4000 },
  { name: "카모마일", price: 3500 }
];

// 사이즈별 가격 차이
// regular가 기본 가격이므로 0
const sizePriceMap = {
  small: -500,
  regular: 0,
  large: 500
};

// 옵션별 가격 차이
// HOT은 기본값이므로 0
// ICE는 얼음/컵 비용이 추가된다고 가정해서 +500
const optionPriceMap = {
  HOT: 0,
  ICE: 500
};

let walletAccount = 1540000; // 초기 지갑 금액