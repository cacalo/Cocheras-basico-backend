export function revisarPropiedadObligatoria(propiedadesInput, body_params ,res){
  let propiedades = propiedadesInput;
  if(typeof propiedadesInput === "string") propiedades = [propiedadesInput];
  propiedades.forEach(propiedad => {
    if(body_params[propiedad] === undefined) {
      return res.status(400).json({ message: `La propiedad "${propiedad}" es necesaria`});
    }
  });
}