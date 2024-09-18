import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function soloAdmin(req,res,next){
  delete req.body.username;
  delete req.body.esAdmin;
  const user = buscarDatosUsuarios(req);
  if(user.username && user.esAdmin){ 
    req.body.username = user.username;
    req.body.esAdmin = user.esAdmin;
    return next();
  }
  return res.sendStatus(401);
}

function soloPrivate(req,res,next){
  if(!req.authorization && !req.headers.authorization) return res.sendStatus(401)
  delete req.body.username;
  delete req.body.esAdmin;
  const user = buscarDatosUsuarios(req);
  if(user.username) {
    req.body.username = user.username;
    return next();
  }
  return res.sendStatus(401);
}

function buscarDatosUsuarios(req){
  const cookieJWT = req.headers.cookie?.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
  const headerJWT = req.headers.authorization?.slice(7)
  const token = cookieJWT || headerJWT;
  const decodificada = jsonwebtoken.verify(token,process.env.JWT_SECRET);
  return {username: decodificada.username, esAdmin: decodificada.esAdmin};
}


export const methods = {
  soloAdmin,
  soloPrivate,
}