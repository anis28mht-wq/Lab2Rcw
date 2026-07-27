const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Représente une réservation de matériel effectuée par un client.
 * Ne fait aucun appel réseau ni accès MongoDB : uniquement des calculs.
 */
export default class Reservation {
  constructor({
    id,
    clientId,
    equipmentId,
    quantity,
    startDate,
    endDate,
    status,
    dailyPrice,
    totalPrice,
  } = {}) {
    this.id = id;
    this.clientId = clientId;
    this.equipmentId = equipmentId;
    this.quantity = Number(quantity);
    this.startDate = startDate ? new Date(startDate) : undefined;
    this.endDate = endDate ? new Date(endDate) : undefined;
    this.status = status || "CONFIRMED";
    this.dailyPrice = dailyPrice !== undefined ? Number(dailyPrice) : undefined;
    this.totalPrice = totalPrice !== undefined ? Number(totalPrice) : undefined;
  }

  isValid() {
    const hasClient = typeof this.clientId === "string" && this.clientId.length > 0;
    const hasEquipment = typeof this.equipmentId === "string" && this.equipmentId.length > 0;
    const validQuantity = Number.isInteger(this.quantity) && this.quantity >= 1;
    const validDates =
      this.startDate instanceof Date &&
      !isNaN(this.startDate) &&
      this.endDate instanceof Date &&
      !isNaN(this.endDate) &&
      this.endDate.getTime() >= this.startDate.getTime();
    return hasClient && hasEquipment && validQuantity && validDates;
  }

  // Premier et dernier jour inclus (EF-22).
  calculateDays() {
    const diff = this.endDate.getTime() - this.startDate.getTime();
    return Math.round(diff / MS_PER_DAY) + 1;
  }

  calculateTotal(dailyPrice) {
    this.dailyPrice = Number(dailyPrice);
    this.totalPrice = this.calculateDays() * this.quantity * this.dailyPrice;
    return this.totalPrice;
  }
}
