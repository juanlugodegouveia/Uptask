<?php
//Obtiene la pagina actual que se ejecute
function obtenerPaginaActual() { //Obtenemos en que pagina estamos posicionados
  $archivo = basename($_SERVER['PHP_SELF']);
  $pagina = str_replace(".php", "", $archivo); //str_replace es una funcion que reemplaza una parte de un string con otra.
  return $pagina;
}
obtenerPaginaActual();


/*Consultas*/

/*Obtener todos los proyectos*/

function obtenerProyectos() {
  include 'conexion.php';
  try {
    return $conn->query('SELECT id, nombre FROM proyectos');
  } catch (Exception $e) {
    echo "Error! : " . $e->getMessagr();
    return false;
  }
}

//Obtener el nombre del proyecto

function obtenerNombreProyecto($id = null) { //Debe tomar un id pero se coloca null en caso de que no se le pase
  include 'conexion.php';
  try {
    return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}");
  } catch (Exception $e) {
    echo "Error! : " . $e->getMessagr();
    return false;
  }
}

//Obtener las tareas del proyecto

function obtenerTareasProyecto($id = null) { //Debe tomar un id pero se coloca null en caso de que no se le pase
  include 'conexion.php';
  try {
    return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
  } catch (Exception $e) {
    echo "Error! : " . $e->getMessagr();
    return false;
  }
}

?>
