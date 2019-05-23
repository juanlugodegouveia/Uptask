<?php  if($accion === 'actualizar') {
  //Importamos la conexion
  include '../funciones/conexion.php';

  echo json_encode($_POST);
}
?>
