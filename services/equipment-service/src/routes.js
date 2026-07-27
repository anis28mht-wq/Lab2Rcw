import { Router } from "express";
import EquipmentModel from "./models/equipmentModel.js";
import EquipmentRepository from "./domain/EquipmentRepository.js";
import EquipmentService from "./domain/EquipmentService.js";

const router = Router();
const repository = new EquipmentRepository(EquipmentModel);
const service = new EquipmentService(repository);

router.get("/", async (req, res, next) => {
  try {
    res.status(200).json(await service.getAll());
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    res.status(200).json(await service.getById(req.params.id));
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

router.put("/:id", async (req, res, next) => {
  try {
    res.status(200).json(await service.update(req.params.id, req.body));
  } catch (err) {
    next(err);
  }
});

router.put("/:id/reserve", async (req, res, next) => {
  try {
    res.status(200).json(await service.reserve(req.params.id, req.body.quantity));
  } catch (err) {
    next(err);
  }
});

router.put("/:id/release", async (req, res, next) => {
  try {
    res.status(200).json(await service.release(req.params.id, req.body.quantity));
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await service.delete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
