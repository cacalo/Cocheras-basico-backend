import { Router } from "express";
import {methods as usuarioController} from "../controllers/usuario.controller";
import {methods as authorization} from "./../middlewares/authorization";

const router=Router();

router.get("/usuarios",authorization.soloAdmin,usuarioController.getAll);
router.get("/usuarios/:username",authorization.soloAdmin,usuarioController.getByUsername);
// router.get("/usuarios/:id",authorization.soloAdmin,usuarioController.getById);
router.put("/usuarios/:username",authorization.soloAdmin,usuarioController.update);
router.delete("/usuarios/:username",authorization.soloAdmin,usuarioController.softDelete);
router.post("/usuarios/:username/enable",authorization.soloAdmin,usuarioController.undelete);

export default router;