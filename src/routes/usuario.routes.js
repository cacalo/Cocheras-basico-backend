import { Router } from "express";
import {methods as usuarioController} from "../controllers/usuario.controller";

const router=Router();

router.get("/usuarios",usuarioController.getAll);
router.get("/usuarios/:username",usuarioController.getByUsername);
// router.get("/usuarios/:id",usuarioController.getById);
router.post("/usuarios",usuarioController.set);
router.put("/usuarios/:username",usuarioController.update);
router.delete("/usuarios/:username",usuarioController.softDelete);
router.post("/usuarios/:username/enable",usuarioController.undelete);

export default router;