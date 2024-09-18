export function revisarPropiedadObligatoria(propiedadesInput, body_params ,res){
  let propiedades = propiedadesInput;
  if(typeof propiedadesInput === "string") propiedades = [propiedadesInput];
  for (let i = 0; i < propiedades.length; i++) {
    const propiedad = propiedades[i];
    console.log("Revisando propiedad ",propiedad, body_params[propiedad])
    if(body_params[propiedad] === undefined) {
      return res.status(400).json({ message: `La propiedad "${propiedad}" es necesaria`}).send();
    }
  }
}