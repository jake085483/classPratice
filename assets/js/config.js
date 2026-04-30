// 메뉴 및 가격
const beverageData = [
  {
    name: "아메리카노",
    price: 3000,
    options: ["HOT", "ICE"],
    sizes: ["small", "regular", "large"]
  },
  {
    name: "아인슈페너",
    price: 4000,
    options: ["HOT", "ICE"],
    sizes: ["regular", "large"]
  },
  {
    name: "초코라떼",
    price: 3500,
    options: ["HOT", "ICE"],
    sizes: ["regular", "large"]
  },
  {
    name: "아이스티",
    price: 3500,
    options: ["ICE"],
    sizes: ["regular", "large"]
  },
  {
    name: "카모마일",
    price: 3500,
    options: ["HOT"],
    sizes: ["regular"]
  },
  {
    name: "오레오 프라페",
    price: 4500,
    options: ["ICE"],
    sizes: ["regular", "large"]
  }
  
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
// ICE는 얼음 비용이 추가된다고 가정해서 +500
const optionPriceMap = {
  HOT: 0,
  ICE: 500
};

/* localStorage에 저장된 walletAccount 값을 꺼내서 숫자로 바꿈 */
const DEFAULT_WALLET_ACCOUNT = 1540000;

const savedWalletAccount = localStorage.getItem("walletAccount");


let walletAccount = savedWalletAccount === null ? DEFAULT_WALLET_ACCOUNT : Number(savedWalletAccount);

// 처음 접속해서 localStorage에 지갑 금액이 없으면 기본 금액을 저장
if (savedWalletAccount === null) {
  localStorage.setItem("walletAccount", String(walletAccount));
}

// 지갑 금액 저장 함수
function saveWalletAccount() {
  localStorage.setItem("walletAccount", String(walletAccount));
}

/* 
  {
    code: "쿠폰",
    type: "퍼센트, 원",
    value: 할인값,
    limit: 사용 가능 횟수
  },
 */
const couponData = [
  {
    code: "1",
    type: "fixed",
    value: 1000,
  },
  {
    code: "cenacle2026",
    type: "percent",
    value: 30,
    limit: 1
  }
];