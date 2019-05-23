<?php

function usuario_autenticado() {
  if(!revisar_usuario() ) { //Sino hay un usuario
    header('Location:login.php');
    exit();
  }
}


function revisar_usuario() {
  return isset($_SESSION['nombre']);
}

session_start(); //Codigo de php. primero se inicia la sesion, luego autentica el usuario al revusar que la sesion exista y sino esta mandalo a login
usuario_autenticado();
 ?>
