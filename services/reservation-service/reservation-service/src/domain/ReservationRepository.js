/**
 * Assure l’accès aux réservations stockées dans MongoDB.
 * Aucun appel aux autres microservices ici.
 */
export default class ReservationRepository {
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
}
