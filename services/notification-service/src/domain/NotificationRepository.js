/**
 * Assure la persistance et la consultation des notifications.
 */
export default class NotificationRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  // Plus récente à plus ancienne (EF-29).
  async findAll() {
    return this.model.find().sort({ createdAt: -1 });
  }
}
