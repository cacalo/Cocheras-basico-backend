import { db } from "../database";
import {revisarPropiedadObligatoria} from "./../helpers/revisarPropiedadObligatoria"
const tabla="usuario"

const getAll = async (req, res) => {
  await db.all(`SELECT * from ${tabla} WHERE eliminado = 0`, (error,rows)=>{
    if (error) return res.status(500).send(error.message);
    return res.send(rows)
  });
};

const getById = async (req, res) => {
  await db.all(`SELECT * from ${tabla} WHERE (id= ? ) and (eliminado=0)`, (error,rows)=>{
    if (error) return res.status(500).send(error.message);
    if (rows.length === 0) return res.json({ message: "Elemento inexistente" });
    return res.send(rows)
  });
};

const getByUsername = async (req, res) => {
  await db.get(`SELECT * from ${tabla} WHERE (username= ? ) and (eliminado=0)`,req.params.username, (error,row)=>{
    if (error) return res.status(500).send(error.message);
    if (!row) return res.status(404).json({ message: "Elemento inexistente" });
    return res.send(row)
  });
};

const set = async (req, res) => {
  revisarPropiedadObligatoria(["username","nombre","apellido","password"],req.body,res);
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

const update = async (req, res) => {
  revisarPropiedadObligatoria("username",req.params,res);
  revisarPropiedadObligatoria(["nombre","apellido","password"],req.body,res);
  await db.get(`SELECT username from ${tabla} WHERE (username= ? )`,req.params.username, async (error,row)=>{
    if (error) return res.status(500).send(error.message);
    if (!row) return res.status(503).send("El usuario que se desea actualizar no existe");
    await db.run(
      `UPDATE ${tabla} SET NOMBRE = ?, APELLIDO = ?, PASSWORD = ? WHERE USERNAME = ?`,[req.body.nombre, req.body.apellido, req.body.password, req.params.username],
      function (error){
        if(error) return res.status(500).send(error.message);
        return res.json({ message: "Ítem modificado con éxito"});
    })
  })
};


export const methods = {
  getAll,
  getById,
  set,
  update,
  getByUsername,
};
