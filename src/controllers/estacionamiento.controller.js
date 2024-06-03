import { db } from "../database";
const tabla="estacionamiento"

const getAll = async (req, res) => {
  await db.all(`SELECT * from ${tabla} WHERE eliminado = 0`, (error,rows)=>{
    if (error) {
      res.status(500);
      return res.send(error.message);
    }
    return res.send(rows)
  });
};

const getById = async (req, res) => {
  await db.get(`SELECT * from ${tabla} WHERE (id= ? ) and (eliminado=0)`, (error,row)=>{
    if (error) {
      res.status(500);
      return res.send(error.message);
    }
    if (!row) return res.json({ message: "Registro de estacionamiento inexistente" });
    return res.send(row)
  });
};


/** Crea un nuevo registro de estacionamiento sin horario de cierre ni costo */
const abrir = async (req, res) => {
  try{
    if(!req.body.patente) return res.json({message:"Falta el valor de patente"});
    if(!req.body.idUsuarioIngreso) return res.json({message:"Falta el valor de idUsuarioIngreso"});
    if(!req.body.idCochera) return res.json({message:"Falta el valor de idCochera"});
                
    await db.get(`SELECT * from ${tabla} WHERE (eliminado IS NOT 1) AND (idCochera = ?) AND (horaEgreso IS NULL)`,req.body.idCochera, async (error,row)=>{
      if (error) {
        res.status(500);
        return res.send(error.message);
      }
      if(row) return res.json({ message: "No se puede abrir una cochera que ya está abierta (La cochera está ocupada)"});
      await db.run(`INSERT into ${tabla} (patente, idCochera, idUsuarioIngreso, horaIngreso) VALUES (?, ?, ?, DATETIME('now', 'localtime'))`,
        [req.body.patente,
        req.body.idCochera,
        req.body.idUsuarioIngreso],
        function (error) {
        if (error) {
          res.status(500);
          return res.send(error.message);
        }
        if(!this.lastID) res.json({ message: "No se pudo abrir el estacionamiento" });
        return res.json({ message: `Cochera ${req.body.idCochera} abierta`, id: this.lastID });
      });
    });
  } catch(err){
    return res.json({message:"Error inesperado",err})
  }
};

/** Da un horario de cierre al estacionamiento y le pone el costo */
const cerrar = async (req, res) => {
  try {
    if(!req.body.patente) return res.json({message:"Falta el valor de patente"});
    if(!req.body.idUsuarioEgreso) return res.json({message:"Falta el valor de idUsuarioEgreso"});

    //Busco que haya una cochera abierta para la patente buscada
    await db.get(`SELECT * from ${tabla} WHERE (eliminado IS NOT 1) AND (patente = ?) AND (horaEgreso IS NULL)`,req.body.patente, async (error,row)=>{
      if (error) {
        res.status(500);
        return res.send(error.message);
      }
      if(!row) {
        res.status(403)
        return res.json({ message: "La patente actual no tiene un estacionamiento activo"});
      }
      const minutosPasados =  (new Date().getTime() - new Date(row.horaIngreso).getTime()) /1000 /60;
      let tarifaABuscar;
      if(minutosPasados <= 30){
        tarifaABuscar = "MEDIAHORA"
      } else if (minutosPasados <= 60){
        tarifaABuscar = "PRIMERAHORA"
      } else {
        tarifaABuscar = "VALORHORA"
      }
      // Busco las tarifas para calcular el costo
      await db.get(`SELECT * from tarifa WHERE (id = ?)`,tarifaABuscar, async (error,rowTarifa)=>{
        if (error) {
          returnres.status(500).send(error.message);
        }
        if(!rowTarifa) {
          return res.status(403).json({ message: "No se encuentra la tarifa para cobrar"});
        }
      
        //Calculo el costo del estacionamiento
        let costo;
        switch (tarifaABuscar){
          case "MEDIAHORA":
          case "PRIMERAHORA":
            costo = rowTarifa.valor;
            break;
          case "VALORHORA":
            costo = rowTarifa.valor / 60 * minutosPasados;
            break;
          default:
            costo = 0;
        }

        // Hago el cierre de la cochera
        await db.run(
          `UPDATE ${tabla} SET idUsuarioEgreso = ?, horaEgreso = DATETIME('now', 'localtime'), costo = ? WHERE id = ?`,[req.body.idUsuarioEgreso,costo,row.id],function(error) {
            if(error){
              res.status(500);
              return res.send(error.message);
            }
            if(!this.changes) {
              res.status(403)
              return res.json({message:"Error indefinido cerrando cochera"})
            };
            return res.json({ message: `Cochera para patente ${req.body.patente} cerrada con éxito`});  
          })
        }
    )}
)}
  catch (error) {
    res.status(500);
    res.send(error);
  }
};

export const methods = {
  getAll,
  getById,
  abrir,
  cerrar,
};
