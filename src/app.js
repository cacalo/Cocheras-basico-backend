import express from "express";
import morgan from "morgan";
const cors = require('cors')

//Routes
import usuarioRoutes from "./routes/usuario.routes";
import tarifaRoutes from "./routes/tarifa.routes";
import cocheraRoutes from "./routes/cochera.routes";
import estacionamientoRoutes from "./routes/estacionamiento.routes";



const app = express();

//Settings
app.set("port",4000);

//Middlewares
app.use(morgan("dev"));
app.use(express.json())
app.use(cors({
  origin: ["http://127.0.0.1:5500"]
}))

//Routes
app.use(usuarioRoutes);
app.use(tarifaRoutes);
app.use(estacionamientoRoutes);
app.use(cocheraRoutes);


export default app;