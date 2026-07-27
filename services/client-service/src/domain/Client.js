/**
 * Représente un client de l’entreprise Eventia Location.
 */
export default class Client {
  constructor({ id, name, email, phone } = {}) {
    this.id = id;
    this.name = typeof name === "string" ? name.trim() : name;
    this.email = typeof email === "string" ? email.trim().toLowerCase() : email;
    this.phone = typeof phone === "string" ? phone.trim() : phone;
  }

  isValid() {
    const hasName = typeof this.name === "string" && this.name.length > 0;
    const hasEmail =
      typeof this.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    const hasPhone = typeof this.phone === "string" && this.phone.length > 0;
    return hasName && hasEmail && hasPhone;
  }
}
