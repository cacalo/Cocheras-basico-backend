import { Router } from "express";
import {methods as cocheraController} from "../controllers/cochera.controller";
import {methods as authorization} from "./../middlewares/authorization";

const router=Router();

router.get("/cocheras",authorization.soloPrivate,cocheraController.getAll);
router.get("/cocheras/:id",authorization.soloPrivate,cocheraController.getById);
router.post("/cocheras",authorization.soloPrivate,cocheraController.set);
router.delete("/cocheras/:id",authorization.soloPrivate,cocheraController.softDelete);
router.put("/cocheras/:id",authorization.soloPrivate,cocheraController.update);
router.post("/cocheras/:id/disable",authorization.soloPrivate,cocheraController.disable);
router.post("/cocheras/:id/enable",authorization.soloPrivate,cocheraController.enable);

export default router;