import Client from "./Client.js";

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Contient la logique applicative du service des clients.
 */
export default class ClientService {
  constructor(repository) {
    this.repository = repository;
  }

  async getAll() {
    return this.repository.findAll();
  }

  async getById(id) {
    const client = await this.repository.findById(id);
    if (!client) {
      throw httpError(404, "Client introuvable");
    }
    return client;
  }

  async create(data) {
    const client = new Client(data);
    if (!client.isValid()) {
      throw httpError(400, "Nom, courriel et téléphone sont requis et le courriel doit être valide");
    }

    const emailTaken = await this.repository.existsByEmail(client.email);
    if (emailTaken) {
      throw httpError(409, "Un client utilise déjà ce courriel");
    }

    return this.repository.create({
      name: client.name,
      email: client.email,
      phone: client.phone,
    });
  }

  async update(id, data) {
    await this.getById(id); // lève 404 si absent

    const client = new Client(data);
    if (!client.isValid()) {
      throw httpError(400, "Nom, courriel et téléphone sont requis et le courriel doit être valide");
    }

    const emailTaken = await this.repository.existsByEmail(client.email, id);
    if (emailTaken) {
      throw httpError(409, "Un client utilise déjà ce courriel");
    }

    return this.repository.update(id, {
      name: client.name,
      email: client.email,
      phone: client.phone,
    });
  }

  async delete(id) {
    await this.getById(id); // lève 404 si absent
    return this.repository.delete(id);
  }
}
