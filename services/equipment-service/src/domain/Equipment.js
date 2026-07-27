/**
 * Représente un matériel disponible à la location.
 */
export default class Equipment {
  constructor({ id, name, category, dailyPrice, availableQuantity } = {}) {
    this.id = id;
    this.name = typeof name === "string" ? name.trim() : name;
    this.category = typeof category === "string" ? category.trim() : category;
    this.dailyPrice = Number(dailyPrice);
    this.availableQuantity = Number(availableQuantity);
  }

  isValid() {
    const hasName = typeof this.name === "string" && this.name.length > 0;
    const hasCategory = typeof this.category === "string" && this.category.length > 0;
    const validPrice = Number.isFinite(this.dailyPrice) && this.dailyPrice >= 0;
    const validQuantity =
      Number.isInteger(this.availableQuantity) && this.availableQuantity >= 0;
    return hasName && hasCategory && validPrice && validQuantity;
  }

  hasEnoughStock(quantity) {
    return Number.isInteger(quantity) && quantity >= 1 && this.availableQuantity >= quantity;
  }
}
