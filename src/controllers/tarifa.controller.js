import { db } from "../database";
const tabla="tarifa"

const getAll = async (req, res) => {
  await db.all(`SELECT * from ${tabla}`, (error,rows)=>{
    if (error) {
      res.status(500);
      res.send(error.message);
      throw error;
    }
    return res.send(rows)
  });
};

const update = async (req, res) => {
   if (req.params.id === undefined) {
      //No se debería ejecutar nunca esta línea :/
      return res.status(400).json({ message: "El ID es necesario" });
    }
    if (req.body.valor === undefined) {
      return res.status(400).json({ message: "Se debe ingresar un nuevo valor para la tarifa" });
    }
     await db.run(
      `UPDATE ${tabla} SET VALOR = ? WHERE id = ?`,[req.body.valor,req.params.id], function (error){
        if(error){
          res.status(500);
          res.send(error.message);
          throw error;
        };
        if(this.changes) return res.json({ message: "Tarifa modificada con éxito"});
        res.status(404);
        return res.json({message: "No hubo ningún cambio o no se encontró ninguna tarifa para cambiar"});
      });
    }

export const methods = {
  getAll,
  update,
};
