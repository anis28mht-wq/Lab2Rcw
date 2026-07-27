/**
 * Assure l’accès aux données persistantes des clients.
 */
export default class ClientRepository {
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

  async existsByEmail(email, excludeId = null) {
    const query = { email };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    const found = await this.model.findOne(query);
    return Boolean(found);
  }
}
