import { Router } from "express";
import {methods as estacionamientoController} from "../controllers/estacionamiento.controller";

const router=Router();

router.get("/estacionamientos",estacionamientoController.getAll);
router.get("/estacionamientos/:id",estacionamientoController.getById);
router.post("/estacionamientos",estacionamientoController.set);
router.put("/estacionamientos/:id",estacionamientoController.update);
router.delete("/estacionamientos/:id",estacionamientoController.disable);

export default router;