import { Router } from "express";
import {methods as tarifasController} from "../controllers/tarifa.controller";

const router=Router();

router.get("/tarifas",tarifasController.getAll);
router.put("/tarifas/:id",tarifasController.update);

export default router;