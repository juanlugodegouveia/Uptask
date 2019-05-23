eventListeners(); //Llamamos los eventos
//Lista de Proyectos
var listaProyectos = document.querySelector('ul#proyectos'); //Creamos una variable global para que sea reutilizable

function eventListeners() {

  //Document Ready
  document.addEventListener('DOMContentLoaded', function() {
    actualizarProgreso();
  });

  //Boton para crear proyecto
  document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

  // Boton para una nueva tarea
  if(document.querySelector('.nueva-tarea') !== null ) { //Quitamos el error al llamar la funcion de nueva tarea
      document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
  }

  //Botones para las acciones de las tareas
  document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);

}

function nuevoProyecto(e) {
  e.preventDefault();
  console.log('le diste click');

  //Crea un input para el nombre del nuevo proyectos

  var nuevoProyecto = document.createElement('li');
  nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
  listaProyectos.appendChild(nuevoProyecto);

  //Seleccionamos el ID con el nuevoProyecto
  var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');

  //Al presionar enter crea el proyecto

  inputNuevoProyecto.addEventListener('keypress', function(e) {
    var tecla = e.wich || e.keyCode;

    if(tecla === 13) {
      guardarProyectoDB(inputNuevoProyecto.value); //Accedemos al nombre del proyecto
      listaProyectos.removeChild(nuevoProyecto);
    }
  });
}

function guardarProyectoDB(nombreProyecto) { //Accedemos al nombre del proyecto y los guardamos para inyectarlo al crear el elemento
  //Crear llamada ajax

  var xhr = new XMLHttpRequest();

  //Enviar datos por formdata

  var datos = new FormData();
  datos.append('proyecto', nombreProyecto);
  datos.append('accion', 'crear');

  //Abrir la conexion

  xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

  //Carga

  xhr.onload = function() {
    if(this.status === 200) {
      console.log(JSON.parse(xhr.responseText));

      //Obetenemos datos de la $respuesta
      var respuesta = JSON.parse(xhr.responseText);
      var proyecto = respuesta.nombre_proyecto,
          id_proyecto = respuesta.id_insertado,
          tipo = respuesta.tipo,
          resultado = respuesta.respuesta;

          //Comprobar la inserción
          if(resultado === 'correcto') {
            //Fue exitoso
            if(tipo === 'crear') {
              //Se creo un nuevo proyecto
              //Inyectar el HTML
              var nuevoProyecto = document.createElement('li');
              nuevoProyecto.innerHTML = `
              <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto:${id_proyecto}">
                   ${proyecto}
              </a>
              `;
              listaProyectos.appendChild(nuevoProyecto); //Agregamos la clase al padre, listaProyectoses es una variable global

              //Enviar alerta

              Swal.fire({
                type: 'success',
                title: 'Proyecto Creado',
                text: 'El proyecto: ' + '"' + proyecto + '"' +' se creó correctamente'
              })
              //Redireccionar a la nueva URL
              .then(resultado => {
                        // redireccionar a la nueva URL
                        if(resultado.value) {
                            window.location.href = 'index.php?id_proyecto=' + id_proyecto;
                        }
                    });
            } else {
              //Se actualizo o se elimino
            }
          } else {
            //Hubo un error
            Swal.fire({
              type: 'error',
              title: 'Error!',
              text: 'No se pudo crear proyecto'
            })
          }
    }
  }

  //Enviar datos

  xhr.send(datos);
}

//Agregar un nueva tarea al proyecto actual

function agregarTarea(e) {
  e.preventDefault();
  var nombreTarea = document.querySelector('.nombre-tarea').value;
  //Validar que el campo tenga algo escrito
  if(nombreTarea === '') {
    Swal.fire({
      type: 'error',
      title: 'Error!',
      text: 'Una tarea no puede ir vacía'
    })
  } else {
    //Si la tarea tiene algo, insertar en PHP


    //Crear llamado a ajax
    var xhr = new XMLHttpRequest();

    //Crear FormData

    var datos = new FormData();
    datos.append('tarea', nombreTarea);
    datos.append('accion', 'crear');
    datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

    //Abrir la conexión
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    //Ejecutarlo y respuesta
    xhr.onload = function() {
      if(this.status ===200) {
        //Todo correcto
        var respuesta = JSON.parse(xhr.responseText);

        //Asignar valores
        var resultado = respuesta.respuesta,
            tarea = respuesta.tarea,
            id_insertado = respuesta.id_insertado,
            tipo = respuesta.tipo;
        if(resultado === 'correcto') {
          //Se agrego correctamente
          if(tipo === 'crear') {
            //Lanzar alerta
            Swal.fire({
              type: 'success',
              title: 'Trea Creada',
              text: 'La tarea: ' + '"' + tarea + '"' +' se creó correctamente'
            })

            //Selecionar el parrafo con la lista vacia

            var parrafoListaVacia = document.querySelectorAll('.lista-vacia');

            if(parrafoListaVacia.length > 0) {
              document.querySelector('.lista-vacia').remove();
            }

            //Construir el template
            var nuevaTarea = document.createElement('li');

            //Agregamos el ID

            nuevaTarea.id = 'tarea:'+id_insertado;

            //Agregamos la clase tareas
            nuevaTarea.classList.add('tarea');

            //Construir el HTML
            nuevaTarea.innerHTML = `
            <p>${tarea}</p>
            <div class="acciones">
            <i class="far fa-check-circle"></i>
            <i class="fas fa-trash"></i>
            </div>
            `;

            //Agregalo al html

            var listado = document.querySelector('.listado-pendientes ul');
            listado.appendChild(nuevaTarea);

            //Limpiar el formulario

            document.querySelector('.agregar-tarea').reset();

            //Actualizar el progreso
            actualizarProgreso();

          }
        } else {
          //Hubo un error
          Swal.fire({
    type: 'error',
    title: 'Error!',
    text: 'Hubo un error'
  })
        }
      }
    }
    //Enviar la consulta
    xhr.send(datos);
  }
}

//Cambia el estado de las tareas o las elimina

function accionesTareas(e) {
  e.preventDefault();

  if(e.target.classList.contains('fa-check-circle')) {
    if(e.target.classList.contains('completo')) {
      e.target.classList.remove('completo');
      cambiarEstadoTarea(e.target, 0);

    } else {
      e.target.classList.add('completo');
      cambiarEstadoTarea(e.target, 1);
    }
  }

  if(e.target.classList.contains('fa-trash')) {
    Swal.fire({
  title: 'Seguro(a)?',
  text: "Esta acción no se puede deshacer",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Si, borrar',
  cancelButtonText: 'Cancelar'
}).then((result) => {
  if (result.value) {

    var tareaEliminar = e.target.parentElement.parentElement;
    //Borrar de la BD

    eliminarTareaBD(tareaEliminar);

    //Borrar del HTML

    tareaEliminar.remove();
    Swal.fire(
      'Eliminado!',
      'La tarea ha sido eliminada',
      'success'
    )
  }
})
  }
}

//Completa o descompleta una tarea

function cambiarEstadoTarea(tarea, estado) {
  var idTarea = tarea.parentElement.parentElement.id.split(':');

  //Crear llamado ajax

  var xhr = new XMLHttpRequest();

  //Información

  var datos = new FormData();
  datos.append('id', idTarea[1]);
  datos.append('accion', 'actualizar');
  datos.append('estado', estado);

  //Abrir la conexion

  xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

  //onload

  xhr.onload = function() {
    if(this.status === 200) {
      console.log(JSON.parse(xhr.responseText));
      //Actualizar el progreso
      actualizarProgreso();
    }
  }
  //Enviamos la petición
  xhr.send(datos);
}

//Elimina las tareas de la BD

function eliminarTareaBD(tarea) {
  var idTarea = tarea.id.split(':');

  //Crear llamado ajax

  var xhr = new XMLHttpRequest();

  //Información

  var datos = new FormData();
  datos.append('id', idTarea[1]);
  datos.append('accion', 'eliminar');

  //Abrir la conexion

  xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

  //onload

  xhr.onload = function() {
    if(this.status === 200) {
      console.log(JSON.parse(xhr.responseText));

      //Comprobar que haya tareas restantes

      var listaTareasRestantes = document.querySelectorAll('li.tarea');
      if(listaTareasRestantes.length === 0) {
        document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
      }

      //Actualizar el progreso
      actualizarProgreso();
    }
  }
  //Enviamos la petición
  xhr.send(datos);
}

//Actualiza el avance del Proyectos
function actualizarProgreso() {
  //Obtener todas las $tareas
  const tareas = document.querySelectorAll('li.tarea');

  //Obtener las tareas completadas
  const tareasCompletadas = document.querySelectorAll('i.completo');

  //Determinar el Avance
  const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

  //Asignar el avance a la barra
  const porcentaje = document.querySelector('#porcentaje');
  porcentaje.style.width = avance+'%';

  //Enviar una alerta al completar el 100
  if(avance ===100) {
    Swal.fire({
      type: 'success',
      title: 'Proyecto terminado',
      text: 'Ya no tienes tareas pendientes'
    })
  }
}
