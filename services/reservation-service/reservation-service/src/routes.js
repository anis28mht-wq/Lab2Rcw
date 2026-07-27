import { Router } from "express";
import ReservationModel from "./models/reservationModel.js";
import ReservationRepository from "./domain/ReservationRepository.js";
import ReservationService from "./domain/ReservationService.js";

const router = Router();
const repository = new ReservationRepository(ReservationModel);
const service = new ReservationService(repository);

router.get("/", async (req, res, next) => {
  try {
    res.status(200).json(await service.getAll());
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    res.status(201).json(await service.create(req.body));
  } catch (err) {
    next(err);
  }
});

router.put("/:id/cancel", async (req, res, next) => {
  try {
    res.status(200).json(await service.cancel(req.params.id));
  } catch (err) {
    next(err);
  }
});

export default router;
