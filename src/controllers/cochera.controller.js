import { db } from "../database";
const tabla="cochera"

const getAll = async (req, res) => {
  await db.all(`SELECT * from ${tabla} WHERE eliminada = 0`, (error,rows)=>{
    if (error) {
      res.status(500);
      return res.send(error.message);
    }
    console.log(rows)
    return res.send(rows)
  });
};

const getById = async (req, res) => {
  await db.get(`SELECT * from ${tabla} WHERE (id= ? ) and (eliminada=0)`,req.params.id, (error,row)=>{
    if (error) {
      res.status(500);
      return res.send(error.message);
    }
    if (!row) return res.json({ message: "Elemento inexistente" });
    return res.send(row)
  });
};

const set = async (req, res) => {
  if (req.body.nombre === undefined) {
    return res.status(400).json({ message: "Por favor completar el nombre de la cochera" });
  }
  await db.run(`INSERT into ${tabla} SET ?`,req.body,function(error) {
      if(error){
        res.status(500);
        return res.send(error.message);
      }
      return res.json({ message: "Cochera añadida con éxito",id:this.lastID });
    }
  );
};

const update = async (req, res) => {
  if (req.params.id === undefined) {
    //No se debería ejecutar nunca esta línea :/
    return res.status(400).json({ message: "El ID es necesario" });
  }
  if (req.body.nombre === undefined) {
    return res.status(400).json({ message: "Por favor completar el nombre de la cochera" });
  }
  await db.run(
    `UPDATE ${tabla} SET ? WHERE id = ?`,[req.body,req.params.id], function (error) {
      if(error){
        res.status(500);
        return res.send(error.message);
      }
      if(this.changes) return res.json({ message: "Ítem actualizado con éxito" });
      res.status(404);
      return res.json({message: "No hubo ningún cambio o no se encontró ninguna cochera para cambiar"});
    }
  );
}

const disable = async (req, res) => {
  console.log("disable",req.params)
    db.run(
      `UPDATE ${tabla} SET DESHABILITADA = 1 WHERE id = ?`,req.params.id, function (error){
        if(error){
          res.status(500);
          return res.send(error.message);
        }
        if(this.changes) return res.json({ message: "Cochera deshabilitada con éxito" });
        res.status(404);
        return res.json({message: "No hubo ningún cambio o no se encontró ninguna cochera para eliminar"});
      }
    )
  }


const enable = async (req, res) => {
  db.run(
    `UPDATE ${tabla} SET DESHABILITADA = 0 WHERE id = ?`,req.params.id,function (error){
      if(error){
        res.status(500);
        return res.send(error.message);
      }
      if(this.changes) return res.json({ message: "Ítem restaurado con éxito" });
      res.status(404);
      return res.json({message: "No hubo ningún cambio o no se encontró ninguna cochera para restaurar"});
    }
  )
}

const softDelete = async (req, res) => {
  console.log(req.params)
  db.run(
    `UPDATE ${tabla} SET ELIMINADA = 1 WHERE id = ?`, req.params.id, function (error){
      if(error){
        res.status(500);
        return res.send(error.message);
      }
      if(this.changes) return res.json({ message: "Cochera eliminado con éxito" });
      res.status(404);
      return res.json({message: "No hubo ningún cambio o no se encontró ninguna cochera para eliminar"});
    }
  )
}

const undelete = async (req, res) => {
db.run(
  `UPDATE ${tabla} SET ELIMINADA = 0 WHERE (id = ?)`, req.params.id, function (error){
    if(error){
      res.status(500);
      return res.send(error.message);
    }
    if(this.changes) return res.json({ message: "Cochera restaurado con éxito" });
      res.status(404);
      return res.json({message: "No hubo ningún cambio o no se encontró ninguna cochera para restaurar"});
  }
)
}

export const methods = {
  getAll,
  getById,
  set,
  disable,
  update,
  enable,
  softDelete,
  undelete
};
