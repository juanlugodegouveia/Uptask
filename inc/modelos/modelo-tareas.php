<?php
$accion = $_POST['accion'];
$id_proyecto = (int) $_POST['id_proyecto'];
$tarea = $_POST['tarea'];
$estado = $_POST['estado'];
$id_tarea = (int) $_POST['id'];

if($accion === 'crear'){

  //Importa la conexion

  include '../funciones/conexion.php';

  try {
    //Realizamos la consulta a la base de datos
    $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?)");
    $stmt->bind_param('si', $tarea, $id_proyecto);
    $stmt->execute();
    /*$respuesta = array(
      'respuesta' => $stmt->affected_rows
    ); Nos indica si se inserto algo*/
    if($stmt->affected_rows > 0) {
      $respuesta = array(
        'respuesta' => 'correcto',
        'id_insertado' => $stmt->insert_id,
        'tipo' => $accion,
        'tarea' => $tarea
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


if($accion === 'actualizar') {
  include '../funciones/conexion.php';

  try {
    //Realizamos la consulta a la base de datos
    $stmt = $conn->prepare("UPDATE tareas set estado = ? WHERE id = ?");
    $stmt->bind_param('ii', $estado, $id_tarea);
    $stmt->execute();
    /*$respuesta = array(
      'respuesta' => $stmt->affected_rows
    ); Nos indica si se inserto algo*/
    if($stmt->affected_rows > 0) {
      $respuesta = array(
        'respuesta' => 'correcto',
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
}

if($accion === 'eliminar') {
  include '../funciones/conexion.php';

  try {
    //Realizamos la consulta a la base de datos
    $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ?");
    $stmt->bind_param('i', $id_tarea);
    $stmt->execute();
    /*$respuesta = array(
      'respuesta' => $stmt->affected_rows
    ); Nos indica si se inserto algo*/
    if($stmt->affected_rows > 0) {
      $respuesta = array(
        'respuesta' => 'correcto',
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
}
?>
