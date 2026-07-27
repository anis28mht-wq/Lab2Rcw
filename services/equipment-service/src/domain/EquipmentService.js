import Equipment from "./Equipment.js";

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Contient la logique applicative du service du matériel.
 */
export default class EquipmentService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const equipment = await this.repository.findById(id);
    if (!equipment) {
      throw httpError(404, "Équipement introuvable");
    }
    return equipment;
  }

  async create(data) {
    const equipment = new Equipment(data);
    if (!equipment.isValid()) {
      throw httpError(
        400,
        "Nom, catégorie, prix quotidien (>= 0) et quantité disponible (>= 0) sont requis"
      );
    }
    return this.repository.create({
      name: equipment.name,
      category: equipment.category,
      dailyPrice: equipment.dailyPrice,
      availableQuantity: equipment.availableQuantity,
    });
  }

  async update(id, data) {
    await this.getById(id); // lève 404 si absent

    const equipment = new Equipment(data);
    if (!equipment.isValid()) {
      throw httpError(
        400,
        "Nom, catégorie, prix quotidien (>= 0) et quantité disponible (>= 0) sont requis"
      );
    }
    return this.repository.update(id, {
      name: equipment.name,
      category: equipment.category,
      dailyPrice: equipment.dailyPrice,
      availableQuantity: equipment.availableQuantity,
    });
  }

  async delete(id) {
    await this.getById(id);
    return this.repository.delete(id);
  }

  async reserve(id, quantity) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      throw httpError(400, "La quantité à réserver doit être un entier >= 1");
    }

    const current = await this.getById(id);
    if (current.availableQuantity < qty) {
      throw httpError(409, "Quantité disponible insuffisante");
    }

    const updated = await this.repository.adjustQuantity(id, -qty);
    if (!updated) {
      // Concurrence : le stock a changé entre la vérification et l'écriture.
      throw httpError(409, "Quantité disponible insuffisante");
    }
    return updated;
  }

  async release(id, quantity) {
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) {
      throw httpError(400, "La quantité à libérer doit être un entier >= 1");
    }

    await this.getById(id); // lève 404 si absent
    return this.repository.adjustQuantity(id, qty);
  }
}
