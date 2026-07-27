import Notification from "./Notification.js";

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Contient la logique applicative du service des notifications.
 */
export default class NotificationService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async create(data) {
    const notification = new Notification(data);
    if (!notification.isValid()) {
      throw httpError(400, "Destinataire, message et type sont requis");
    }
    return this.repository.create({
      recipient: notification.recipient,
      message: notification.message,
      type: notification.type,
    });
  }
}
