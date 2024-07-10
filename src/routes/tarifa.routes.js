import { Router } from "express";
import {methods as tarifasController} from "../controllers/tarifa.controller";
import {methods as authorization} from "./../middlewares/authorization";

const router=Router();

router.get("/tarifas",authorization.soloPrivate,tarifasController.getAll);
router.put("/tarifas/:id",authorization.soloPrivate,tarifasController.update);

export default router;