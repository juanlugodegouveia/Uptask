<?php
$accion = $_POST['accion'];
$proyecto = $_POST['proyecto'];

if($accion === 'crear'){

  //Importa la conexion

  include '../funciones/conexion.php';

  try {
    //Realizamos la consulta a la base de datos
    $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?)");
    $stmt->bind_param('s', $proyecto);
    $stmt->execute();
    /*$respuesta = array(
      'respuesta' => $stmt->affected_rows
    ); Nos indica si se inserto algo*/
    if($stmt->affected_rows > 0) {
      $respuesta = array(
        'respuesta' => 'correcto',
        'id_insertado' => $stmt->insert_id,
        'tipo' => $accion,
        'nombre_proyecto' => $proyecto
      );
    } else {
      $respuesta = array(
        'respuesta' => 'error'
      );
    }
    $stmt->close();
    $conn->close();
  } catch(Exception $e) {
    //En caso de error, tomar la Exception
    $respuesta = array(
      'error' => $e->getMessage()
    );
  } //Catch
  echo json_encode($respuesta);
}//if $accion
?>
