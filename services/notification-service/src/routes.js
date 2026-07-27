import { Router } from "express";
import NotificationModel from "./models/notificationModel.js";
import NotificationRepository from "./domain/NotificationRepository.js";
import NotificationService from "./domain/NotificationService.js";

const router = Router();
const repository = new NotificationRepository(NotificationModel);
const service = new NotificationService(repository);

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

export default router;
