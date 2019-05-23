(function () { // Para que se ejecute solo una vez
"use strict";
document.addEventListener('DOMContentLoaded', function () { //Agregado del proyecto, para que cargue primero el html y luego las funciones

eventListeners();

function eventListeners() {

  //if() {}, en caso de ser necesario si da error en el DOM, recordar declar los nombres de las variables de las funciones antes de llamar los eventos.
  document.querySelector('#formulario').addEventListener('submit', validarRegistro);

} //eventListeners

function validarRegistro(e) {
  e.preventDefault(); //Lo uitilizamos para prevenir salto de pagina en el DOM al momento de dar click, este salto se debe que por default envia el formulario

  //Creamos nuestras variables
  var usuario = document.querySelector('#usuario').value,
      password = document.querySelector('#password').value,
      tipo = document.querySelector('#tipo').value;

      if(usuario === '' || password === ''){
        //La validacióm fallo
        Swal.fire({
  type: 'error',
  title: 'Error!',
  text: 'Ambos campos son obligatorios'
})
} else {
  //Ambos campos son correctos, realiza llamado de Ajax

  //Datos que se envian al servidor
  var datos = new FormData(); //Crea una estructura para darle una llave y un valor

  datos.append('usuario', usuario);//Nuestra llave es usuario y el valor es nuestro input que se llama usuario tambien
  datos.append('password', password);
  datos.append('accion', tipo);

  //Creamos el llamado a Ajax

  var xhr = new XMLHttpRequest();

  //Abrimos la conexión

  xhr.open('POST', 'inc/modelos/modelo-admin.php', true);

  //Retorno los Datos

  xhr.onload = function() {
    if(this.status === 200) {
      /*console.log(JSON.parse(xhr.responseText)); //Respuesta que viene desde el servidor, en este caso modelo-admin, JSON.parse toma el string generado en modelo-admin y lo convierte en un objeto*/
      var respuesta = JSON.parse(xhr.responseText);

      console.log(respuesta);
      //Si la respuesta es correcta
      if(respuesta.respuesta === 'correcto') {
        //Si es un nuevo usuario
        if(respuesta.tipo == 'crear') {
          Swal.fire({
            type: 'success',
            title: 'Usuario Creado',
            text: 'El usuario se creó correctamente'
          })
        } else if(respuesta.tipo === 'login') {
          Swal.fire({
            type: 'success',
            title: 'Login Correcto',
            text: 'Presiona OK para abrir el DashBoard'
          })
          .then(resultado => {
            if(resultado.value) {
              window.location.href = 'index.php';
            }
          })
        }
      } else {
        //Hubo un error
        Swal.fire({
          type: 'error',
          title: 'Error',
          text: 'Hubo un error'
        });
      }
    }
  }

  //Enviamos la peticiónote

  xhr.send(datos); //Enviamos lo que se encuentra en el FormData
}//else
}//function
}); //DOM CONTENT LOADED
})(); //Strict
