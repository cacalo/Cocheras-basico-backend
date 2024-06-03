import { Router } from "express";
import {methods as estacionamientoController} from "../controllers/estacionamiento.controller";

const router=Router();

router.get("/estacionamientos",estacionamientoController.getAll);
router.get("/estacionamientos/:id",estacionamientoController.getById);
router.post("/estacionamientos/abrir",estacionamientoController.abrir);
router.patch("/estacionamientos/cerrar",estacionamientoController.cerrar);

export default router;