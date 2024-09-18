import express from "express";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
const cors = require('cors');

//Routes
import usuarioRoutes from "./routes/usuario.routes";
import tarifaRoutes from "./routes/tarifa.routes";
import cocheraRoutes from "./routes/cochera.routes";
import estacionamientoRoutes from "./routes/estacionamiento.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

//Settings
app.set("port",4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json())
app.use(cors({
  origin: "*"
}));
app.use(cookieParser())


//Routes
app.use(usuarioRoutes);
app.use(tarifaRoutes);
app.use(estacionamientoRoutes);
app.use(cocheraRoutes);
app.use(authRoutes);

export default app;