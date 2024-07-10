import { db } from "../services/database";
const tabla="tarifa"

const getAll = async (req, res) => {
  await db.all(`SELECT * from ${tabla}`, (error,rows)=>{
    if (error) return res.status(500).send(error.message);
    return res.send(rows)
  });
};

const update = async (req, res) => {
   if (req.params.id === undefined) return res.status(400).json({ message: "El ID es necesario" });
    if (req.body.valor === undefined) {
      return res.status(400).json({ message: "Se debe ingresar un nuevo valor para la tarifa" });
    }
     await db.run(
      `UPDATE ${tabla} SET VALOR = ? WHERE id = ?`,[req.body.valor,req.params.id], function (error){
        if(error) res.status(500).send(error.message);
        if(this.changes) return res.json({ message: "Tarifa modificada con éxito"});
        return res.status(404).json({message: "No hubo ningún cambio o no se encontró ninguna tarifa para cambiar"});
      });
    }

export const methods = {
  getAll,
  update,
};
