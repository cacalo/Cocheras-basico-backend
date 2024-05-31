import { Router } from "express";
import {methods as cocheraController} from "../controllers/cochera.controller";

const router=Router();

router.get("/cocheras",cocheraController.getAll);
router.get("/cocheras/:id",cocheraController.getById);
router.post("/cocheras",cocheraController.set);
router.delete("/cocheras/:id",cocheraController.softDelete);
router.put("/cocheras/:id",cocheraController.update);
router.post("/cocheras/:id/disable",cocheraController.disable);
router.post("/cocheras/:id/enable",cocheraController.enable);

export default router;