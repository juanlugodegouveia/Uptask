<script src="js/sweetalert2.all.min.js"></script>
<?php $actual = obtenerPaginaActual(); //Funcion creada para obtener la pagina actual en donde estamos posicionados, en este caso para no perder la conexion del body ya que abre en el header y cierra en el footer
if($actual === 'crear-cuenta' || $actual === 'login') {
  echo '<script src="js/formulario.js"></script>'; //Cargamos nuestro sistema de logueo o creacion de cuenta
} else { //Sera visible solo para usuarios que se han logueado al sistema
  echo '<script src="js/scripts.js"></script>';
}
?>
</body>
</html>
