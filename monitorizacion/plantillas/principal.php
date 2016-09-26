<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="author" content="Patricia Fernandez-Mari&ntilde;as Bustamante">
    <title>Monitorizaci&oacute;n Laboratorio de Inform&aacute;tica</title>
    <link href="./style/style.css" rel="stylesheet" type="text/css">
    
    <!--Libreria necesaria para Javascript-->
    <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>

    <!--Script para mostrar los datos-->
    <script src="./script/script.js"></script>
  
  </head>

  <body>
  
    <!--Contenedor de la pagina-->
  	<div id="container">
   
      <!--Seccion principal -->
  		<div id="seccionPrincipal">
       			 
  		</div> <!--Fin seccion principal-->
  		
		<!--Seccion derecha con ocupacion general de aulas-->
		<?php include './plantillas/seccionDerecha.php';?>
		
		<!--Seccion inferior -->
		<?php include './plantillas/seccionInferior.php';?>
  		
    </div>
  </body>
</html>
