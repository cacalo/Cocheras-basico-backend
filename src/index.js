import app from "./app";


const main=()=>{
  app.listen(app.get("port"));
  console.log(`Servidor iniciado en puerto ${app.get("port")}`)
}

main();