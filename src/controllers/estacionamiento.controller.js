import { db } from "../database";
const tabla="estacionamiento"

const getAll = async (req, res) => {
  await db.all(`SELECT * from ${tabla} WHERE eliminado = 0`, (error,rows)=>{
    if (error) {
      res.status(500);
      res.send(error.message);
      throw error;
    }
    return res.send(rows)
  });
};

const getById = async (req, res) => {
  await db.get(`SELECT * from ${tabla} WHERE (id= ? ) and (eliminado=0)`, (error,row)=>{
    if (error) {
      res.status(500);
      res.send(error.message);
      throw error;
    }
    if (!row) return res.json({ message: "Elemento inexistente" });
    return res.send(row)
  });
};

const getByUsername = async (req, res) => {
  console.log(req.params.username)
  await db.all(`SELECT * from ${tabla} WHERE (username= ? ) and (eliminado=0)`,req.params.username, (error,rows)=>{
    if (error) {
      res.status(500);
      res.send(error.message);
      throw error;
    }
    if (rows.length === 0) return res.json({ message: "Elemento inexistente" });
    return res.send(rows[0])
  });
};

// EN DESUSO
const set = async (req, res) => {
  try {
    if (req.body.nombre === undefined) {
      return res.status(400).json({ message: "Por favor completar el nombre del producto" });
    }
    const connection = await getConnection();
    const result = await connection.query(
      `INSERT into ${tabla} SET ?`,
      req.body
    );
    res.json({ message: "Ítem añadido con éxito", id: result.insertId });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

// EN DESUSO
const update = async (req, res) => {
  try {
    if (req.params.id === undefined) {
      //No se debería ejecutar nunca esta línea :/
      return res.status(400).json({ message: "El ID es necesario" });
    }
    const connection = await getConnection();
    const result = await connection.query(
      `UPDATE ${tabla} SET ? WHERE id = ?`,[req.body,req.params.id]);
    res.json({ message: "Ítem modificado con éxito", id: result.insertId });  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

// EN DESUSO
const disable = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(
      `UPDATE ${tabla} SET ? WHERE (id = ?) and (deleted=0)`,[{deleted:1},req.params.id]);
    if(result.affectedRows === 0){
      return res.json({ message: "No se encontró un registro con ese ID" });
    }
    res.json({ message: "Ítem eliminado"});
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

// EN DESUSO
const restore = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(
      "UPDATE producto SET ? WHERE id = ?",[{deleted:0},req.params.id]);
    if(result.affectedRows === 0){
      return res.json({ message: "No se encontró un registro con ese ID" });
    }
    res.json({ message: "Ítem eliminado"});
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};



export const methods = {
  getAll,
  getById,
  set,
  disable,
  update,
  restore,
  getByUsername,
};
