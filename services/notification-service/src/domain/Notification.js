/**
 * Représente une notification produite par l’application.
 * L’envoi est simulé : seul l’enregistrement en base est requis.
 */
export default class Notification {
  constructor({ id, recipient, message, type, createdAt } = {}) {
    this.id = id;
    this.recipient = typeof recipient === "string" ? recipient.trim() : recipient;
    this.message = typeof message === "string" ? message.trim() : message;
    this.type = typeof type === "string" && type.trim().length > 0 ? type.trim() : "INFO";
    this.createdAt = createdAt;
  }

  isValid() {
    const hasRecipient = typeof this.recipient === "string" && this.recipient.length > 0;
    const hasMessage = typeof this.message === "string" && this.message.length > 0;
    const hasType = typeof this.type === "string" && this.type.length > 0;
    return hasRecipient && hasMessage && hasType;
  }
}
