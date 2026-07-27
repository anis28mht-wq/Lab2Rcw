/**
 * Assure l’accès aux données persistantes du matériel.
 */
export default class EquipmentRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll() {
    return this.model.find().sort({ createdAt: -1 });
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return this.model.findByIdAndDelete(id);
  }

  /**
   * Ajuste la quantité disponible de façon atomique.
   * delta négatif = réservation, delta positif = remise en disponibilité.
   * Le filtre availableQuantity >= -delta empêche le stock de devenir
   * négatif même en cas d'appels concurrents (EF-14, EF-15).
   */
  async adjustQuantity(id, delta) {
    return this.model.findOneAndUpdate(
      { _id: id, availableQuantity: { $gte: -delta } },
      { $inc: { availableQuantity: delta } },
      { new: true }
    );
  }
}
