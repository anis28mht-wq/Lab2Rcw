import axios from "axios";
import Reservation from "./Reservation.js";

function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

/**
 * Orchestre le cas d’utilisation principal de réservation.
 * Coordonne l’entité Reservation, son dépôt et les autres microservices.
 */
export default class ReservationService {
  constructor(repository) {
    this.repository = repository;
    this.clientServiceUrl =
      process.env.CLIENT_SERVICE_URL || "http://localhost:4001/api/clients";
    this.equipmentServiceUrl =
      process.env.EQUIPMENT_SERVICE_URL || "http://localhost:4002/api/equipments";
    this.notificationServiceUrl =
      process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4004/api/notifications";
  }

  async getAll() {
    return this.repository.findAll();
  }

  async _fetchClient(clientId) {
    try {
      const { data } = await axios.get(`${this.clientServiceUrl}/${clientId}`);
      return data;
    } catch (err) {
      if (err.response?.status === 404) {
        throw httpError(404, "Client introuvable");
      }
      throw httpError(502, "Le service client est indisponible");
    }
  }

  async _fetchEquipment(equipmentId) {
    try {
      const { data } = await axios.get(`${this.equipmentServiceUrl}/${equipmentId}`);
      return data;
    } catch (err) {
      if (err.response?.status === 404) {
        throw httpError(404, "Équipement introuvable");
      }
      throw httpError(502, "Le service matériel est indisponible");
    }
  }

  async _reserveStock(equipmentId, quantity) {
    try {
      const { data } = await axios.put(
        `${this.equipmentServiceUrl}/${equipmentId}/reserve`,
        { quantity }
      );
      return data;
    } catch (err) {
      if (err.response?.status === 409) {
        throw httpError(409, "Quantité disponible insuffisante");
      }
      throw httpError(502, "Le service matériel est indisponible");
    }
  }

  async _releaseStock(equipmentId, quantity) {
    try {
      await axios.put(`${this.equipmentServiceUrl}/${equipmentId}/release`, { quantity });
    } catch (err) {
      // On journalise sans faire échouer l'opération principale : l'annulation
      // (ou le rollback ci-dessous) doit rester visible même si la remise en
      // stock échoue.
      console.error("Impossible de remettre le stock en disponibilité :", err.message);
    }
  }

  async _notify(recipient, message, type) {
    try {
      await axios.post(this.notificationServiceUrl, { recipient, message, type });
    } catch (err) {
      console.error("Impossible de créer la notification :", err.message);
    }
  }

  async create(data) {
    const reservation = new Reservation(data);
    if (!reservation.isValid()) {
      throw httpError(
        400,
        "Client, équipement, quantité (>= 1) et dates valides (fin >= début) sont requis"
      );
    }

    const client = await this._fetchClient(reservation.clientId);
    const equipment = await this._fetchEquipment(reservation.equipmentId);
    const equipmentId = equipment._id || equipment.id;

    // On réserve le stock avant de persister : si la réservation de stock
    // échoue (insuffisant), aucune trace n'est créée côté réservation.
    await this._reserveStock(equipmentId, reservation.quantity);

    reservation.calculateTotal(equipment.dailyPrice);

    let saved;
    try {
      saved = await this.repository.create({
        clientId: client._id || client.id,
        clientName: client.name,
        equipmentId,
        equipmentName: equipment.name,
        quantity: reservation.quantity,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        dailyPrice: reservation.dailyPrice,
        totalPrice: reservation.totalPrice,
        status: "CONFIRMED",
      });
    } catch (err) {
      // La sauvegarde a échoué après la réservation du stock : on annule pour
      // ne pas bloquer du matériel pour une réservation qui n'existe pas.
      await this._releaseStock(equipmentId, reservation.quantity);
      throw httpError(500, "Impossible d'enregistrer la réservation");
    }

    await this._notify(
      client.email || client.name,
      `Réservation confirmée pour ${equipment.name} (${reservation.quantity} x ${reservation.calculateDays()} jour(s))`,
      "RESERVATION_CONFIRMED"
    );

    return saved;
  }

  async cancel(id) {
    const reservation = await this.repository.findById(id);
    if (!reservation) {
      throw httpError(404, "Réservation introuvable");
    }
    if (reservation.status === "CANCELLED") {
      throw httpError(409, "Cette réservation est déjà annulée");
    }

    await this._releaseStock(reservation.equipmentId, reservation.quantity);
    const updated = await this.repository.update(id, { status: "CANCELLED" });

    await this._notify(
      reservation.clientName || reservation.clientId,
      `Réservation annulée pour ${reservation.equipmentName || reservation.equipmentId}`,
      "RESERVATION_CANCELLED"
    );

    return updated;
  }
}
