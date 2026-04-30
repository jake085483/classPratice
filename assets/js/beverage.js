// Beverage.js
export class Beverage {
  constructor(index, name, price) {
    this.id = index;
    this.name = name;
    this.price = price;
  }

  getReceipt(option) {
    return `메뉴: ${this.name}, 가격: ${this.price}원, 옵션: ${option}, 사이즈: ${size}`;
  }
}