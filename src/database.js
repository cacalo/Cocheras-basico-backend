import sqlite3 from "sqlite3";

export const db = new sqlite3.Database("./database.db",(err) => {
    if (err) console.error("ERROR "+err.errno+" |",err.message);
    else {
      console.log("Conectado a la base de datos.");
    }
  }
);