import { Router } from "express";
import ClientModel from "./models/clientModel.js";
import ClientRepository from "./domain/ClientRepository.js";
import ClientService from "./domain/ClientService.js";

const router = Router();
const repository = new ClientRepository(ClientModel);
const service = new ClientService(repository);

router.get("/", async (req, res, next) => {
  try {
    const clients = await service.getAll();
    res.status(200).json(clients);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const client = await service.getById(req.params.id);
    res.status(200).json(client);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const client = await service.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const client = await service.update(req.params.id, req.body);
    res.status(200).json(client);
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
