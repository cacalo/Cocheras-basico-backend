import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { revisarPropiedadObligatoria } from "./../helpers/revisarPropiedadObligatoria"
import { db } from "../services/database";
const tabla="usuario"

dotenv.config();

const register = async (req,res) => {
  if(revisarPropiedadObligatoria(["username","nombre","apellido","password"],req.body,res))return;;
  const nuevoUsuario = {
    username: req.body.username,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    password: req.body.password,
    eliminado: 0,
    esAdmin: 0,
  }
  // Verifico que no exista ese nombre de usuario
  await db.get(`SELECT username from ${tabla} WHERE (username= ? )`,req.body.username, async (error,row)=>{
    if (error) return res.status(500).send(error.message);
    if (row) return res.status(503).send("El usuario que se intenta agregar ya existe");
    
    const salt = await bcryptjs.genSalt(5);
    nuevoUsuario.password = await bcryptjs.hash(nuevoUsuario.password,salt);
    console.log(nuevoUsuario.password, await bcryptjs.hash(nuevoUsuario.password,salt))

    await db.run(
      `INSERT into ${tabla} VALUES (?,?,?,?,?,?)`,
      [nuevoUsuario.username,nuevoUsuario.nombre,nuevoUsuario.apellido,nuevoUsuario.password,nuevoUsuario.eliminado,nuevoUsuario.esAdmin],
      (error,row) => {
        if (error) return res.status(500).send(error.message);
        return res.status(201).json({ message: "Ítem añadido con éxito", row });
      }
    );
  })
}

const login = async (req,res) => {
  console.log(req.body);
  console.log("REQ",req.body)
  const user = req.body.username;
  const password = req.body.password;
  if(revisarPropiedadObligatoria(["username","password"],req.body,res))return;


  await db.get(`SELECT * from ${tabla} WHERE (username= ?) and (eliminado=0)`,user, async (error,row)=>{
    if (error) return res.status(500).send(error.message);
    console.log("ROW",row)
    if (!row) return res.status(400).send({mensaje:"Error durante login"});
    const loginCorrecto = await bcryptjs.compare(password,row.password);
    if(!loginCorrecto){
      return res.status(400).send({status:"Error",mensaje:"Error durante login"})
    }
    const token = jsonwebtoken.sign(
      {username:row.username, esAdmin: row.esAdmin},
      process.env.JWT_SECRET,
      {expiresIn:process.env.JWT_EXPIRATION});
  
      const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        path: "/"
      }
      res.cookie("jwt",token,cookieOption);
      res.send({status:"ok",mensaje:"Usuario loggeado",token});
  }) 
}



export const methods = {
  login,
  register,
}