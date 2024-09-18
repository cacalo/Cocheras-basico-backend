import { revisarPropiedadObligatoria } from "./../helpers/revisarPropiedadObligatoria"
import { db } from "../services/database";
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

/** Busca un usuario en la DB pero no envía una respuesta al front */
export const getByUsername_noResponse = async (req, res) => {
  await db.get(`SELECT * from ${tabla} WHERE (username= ? ) and (eliminado=0)`,req.params.username, (error,row)=>{
    if (error) return res.status(500).send(error.message);
    if (!row) return res.status(404).json({ message: "Elemento inexistente" });
    return row;
  });
};

const update = async (req, res) => {
  if(revisarPropiedadObligatoria("username",req.params,res))return;
  if(revisarPropiedadObligatoria(["nombre","apellido","password"],req.body,res))return;
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

const softDelete = async (req, res) => {
  db.run(
    `UPDATE ${tabla} SET ELIMINADO = 1 WHERE username = ?`, req.params.username, function (error){
      if(error){
        return res.status(500).send(error.message);
      }
      if(this.changes) return res.json({ message: "Usuario eliminado con éxito" });
      return res.status(404).json({message: "No hubo ningún cambio o no se encontró ningun usuario para eliminar"});
    }
  )
}

const undelete = async (req, res) => {
  db.run(
    `UPDATE ${tabla} SET ELIMINADO = 0 WHERE (username = ?)`, req.params.username, function (error){
      if(error){
        return res.status(500).send(error.message);
      }
      if(this.changes) return res.json({ message: "Usuario restaurado con éxito" });
      return res.status(404).json({message: "No hubo ningún cambio o no se encontró ningun usuario para restaurar"});
    }
  )
}


export const methods = {
  getAll,
  getById,
  update,
  getByUsername,
  softDelete,
  undelete,
};
