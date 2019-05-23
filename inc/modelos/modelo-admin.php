<?php
/*die(json_encode($_POST)); //Manera de comprobar que nuestro datos estan siendo enviados*/

if(isset($_POST["accion"])) { //Agregado por mi

$accion = $_POST['accion'];
$password = $_POST['password'];
$usuario = $_POST['usuario'];

if($accion === 'crear'){
  //Código para crear los administradores

  //Hashear password
  $opciones = array(
    'cost' => 12
  );

  $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones); //Encriptar password. sintaxis

  //Importa la conexion

  include '../funciones/conexion.php';

  try {
    //Realizamos la consulta a la base de datos
    $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?)");
    $stmt->bind_param('ss', $usuario, $hash_password);
    $stmt->execute();
    /*$respuesta = array(
      'respuesta' => $stmt->affected_rows
    ); Nos indica si se inserto algo*/
    if($stmt->affected_rows > 0) {
      $respuesta = array(
        'respuesta' => 'correcto',
        'id_insertado' => $stmt->insert_id,
        'tipo' => $accion
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
} //isset agregado por mi

if(isset($_POST["accion"])) { //Agregado por mi

if($accion === 'login') {
  //Escribir código que loguee a los administradores
  include '../funciones/conexion.php';

  try {
    //Seleccionar el administrador de la base de datos
    $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
    $stmt->bind_param('s', $usuario);
    $stmt->execute();
    //Loguear el usuario
    $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
    $stmt->fetch();
    if($nombre_usuario) {
      //Validamos de que el usuario exista
      if(password_verify($password, $pass_usuario)) { //Verificamos el password con funcion de php
        //Iniciar la sesion si el usuario y password son correctos
        session_start();
        $_SESSION['nombre'] = $usuario;
        $_SESSION['id'] = $id_usuario;
        $_SESSION['login'] = true;
        //Login Correcto
        $respuesta = array(
          'respuesta' => 'correcto',
          'nombre' => $nombre_usuario,
          'tipo' => $accion
        );
      } else {
        //Login Incorrecto, enviar error
        $respuesta = array(
          'resultado' => 'Password Incorrecto'
        );
      }
    } else {
      $respuesta = array(
        'error' => 'Usuario no existe'
      );
    }
    $stmt->close();
    $conn->close();
  } catch(Exception $e) {
    //En caso de error, tomar la Exception
    $respuesta = array(
      'pass' => $e->getMessage()
    );
  } //Catch
  echo json_encode($respuesta);
}
} //isset agregado por mi
?>
