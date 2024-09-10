const User = require('../models/users');
 
function obtainUser(
  { username: username, id: id, email: email },
  usuarioLoggeadoId
) {
  if (username) {
    return obtainUserWithQuery({ username: username }, usuarioLoggeadoId);
  } else if (id) {
    return obtainUserWithQuery({ _id: id });
  } else if (email) {
    return obtainUserWithQuery({ email: email });
  } else {
    throw new Error(
      'Función obtener usuario del controller fue llamada sin especificar username, email o id.'
    );
  }
}

async function obtainUserWithQuery(query, usuarioLoggeadoId) {
  const user = await User.findOne(query)


  if (usuarioLoggeadoId && user) {
    const sigueAUsuarioLoggeado = await obtenerSiUsuarioLoggeadoSigueAUsuario(
      user._id,
      usuarioLoggeadoId
    );
    user.siguiendo = sigueAUsuarioLoggeado;
  }

  return user;
}




module.exports = {

  obtainUser,
};
