import { Router } from "express";
import {methods as estacionamientoController} from "../controllers/estacionamiento.controller";
import {methods as authorization} from "./../middlewares/authorization";

const router=Router();

router.get("/estacionamientos",authorization.soloPrivate,estacionamientoController.getAll);
router.get("/estacionamientos/:id",authorization.soloPrivate,estacionamientoController.getById);
router.post("/estacionamientos/abrir",authorization.soloPrivate,estacionamientoController.abrir);
router.patch("/estacionamientos/cerrar",authorization.soloPrivate,estacionamientoController.cerrar);

export default router;