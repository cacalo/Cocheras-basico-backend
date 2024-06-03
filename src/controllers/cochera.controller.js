import { db } from "../database";
const tabla="cochera"

const getAll = async (req, res) => {
  await db.all(`SELECT * from ${tabla} WHERE eliminada IS NOT 1`, (error,rows)=>{
    if (error) {
      return res.status(500).send(error.message);
    }
    console.log(rows)
    return res.send(rows)
  });
};

const getById = async (req, res) => {
  await db.get(`SELECT * from ${tabla} WHERE (id= ? ) and (eliminada IS NOT 1)`,req.params.id, (error,row)=>{
    if (error) {
      return res.status(500).send(error.message);
    }
    if (!row) return res.json({ message: "Elemento inexistente" });
    return res.send(row)
  });
};

const set = async (req, res) => {
  if (req.body.descripcion === undefined) return res.status(400).json({ message: "La cochera requiere una descripción"})
  await db.run(`INSERT into ${tabla} (descripcion) VALUES (?)`,req.body.descripcion,function(error) {
    if(error){
      return res.status(500).send(error.message);
    }
    return res.json({ message: "Cochera añadida con éxito",id:this.lastID });
    }
  );
};

const update = async (req, res) => {
  if (req.params.id === undefined) return res.status(400).json({ message: "El ID es necesario" });
  if (req.body.descripcion === undefined) return res.status(400).json({ message: "La cochera requiere una descripción"});

  await db.run(
    `UPDATE ${tabla} SET descripcion = ? WHERE id = ?`,[req.body.descripcion,req.params.id], function (error) {
      if(error){
        return res.status(500).send(error.message);
      }
      if(this.changes) return res.json({ message: "Ítem actualizado con éxito" });
      return res.status(404).json({message: "No hubo ningún cambio o no se encontró ninguna cochera para cambiar"});
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
        return res.status(404).json({message: "No hubo ningún cambio o no se encontró ninguna cochera para eliminar"});
      }
    )
  }


const enable = async (req, res) => {
  db.run(
    `UPDATE ${tabla} SET DESHABILITADA IS NOT 0 WHERE id = ?`,req.params.id,function (error){
      if(error){
        res.status(500);
        return res.send(error.message);
      }
      if(this.changes) return res.json({ message: "Ítem restaurado con éxito" });
      return res.status(404).json({message: "No hubo ningún cambio o no se encontró ninguna cochera para restaurar"});
    }
  )
}

const softDelete = async (req, res) => {
  console.log(req.params)
  db.run(
    `UPDATE ${tabla} SET ELIMINADA = 1 WHERE id = ?`, req.params.id, function (error){
      if(error){
        return res.status(500).send(error.message);
      }
      if(this.changes) return res.json({ message: "Cochera eliminado con éxito" });
      return res.status(404).json({message: "No hubo ningún cambio o no se encontró ninguna cochera para eliminar"});
    }
  )
}

const undelete = async (req, res) => {
db.run(
  `UPDATE ${tabla} SET ELIMINADA IS NOT 1 WHERE (id = ?)`, req.params.id, function (error){
    if(error){
      return res.status(500).send(error.message);
    }
    if(this.changes) return res.json({ message: "Cochera restaurado con éxito" });
    return res.status(404).json({message: "No hubo ningún cambio o no se encontró ninguna cochera para restaurar"});
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
