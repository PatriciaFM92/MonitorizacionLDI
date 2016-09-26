<?php
	$db_host = '';
    $db_user = '';
    $db_pwd = '';
    $database = '';
	
    $error = '';
    
    /*Variables pasadas como argumento*/
    $aula=$_GET["aula"];
    $cuatrimestre=$_GET["cuatrimestre"];
    $dia=$_GET["dia"];
    $fecha=$_GET["fecha"];
    $h_actual=$_GET["hora_actual"];
    
    // Conexion con base de datos        
    if (!mysql_connect($db_host, $db_user, $db_pwd))
        $error = "No se puede conectar con la base de datos: " . mysql_error() . "<br>";
            
    if (!mysql_select_db($database))
        $error .= "No se puede seleccionar la tabla: " . mysql_error() . "<br>";
            
    // Envio de consulta SQL
    mysql_query("SET NAMES 'utf8'");
    
    //$query="SELECT * FROM reservas_reservas ORDER BY fecha";
    $query="SELECT asig.nombre, res.hora_inicio, res.hora_fin, aul.nombre AS a_nombre, res.dia, res.cuatrimestre FROM reservas_reservas res INNER JOIN reservas_aulas aul ON res.aula = aul.id INNER JOIN reservas_asignatura asig ON res.asignatura = asig.id WHERE ((res.tipo_reserva = 0 AND res.cuatrimestre = ". $cuatrimestre . " AND res.dia = '" . $dia . "') OR (res.tipo_reserva = 1 AND res.fecha = '" . $fecha . "')) AND aul.nombre = '" . $aula . "' AND res.confirmada = 1 AND ((res.hora_inicio >= '" . $h_actual . "') OR (res.hora_inicio < '" . $h_actual . "' AND res.hora_fin > '" . $h_actual . "')) ORDER BY res.hora_inicio";
    // $query="SELECT * FROM reservas_aulas";
    //echo $query . "<br>";        
    $result = mysql_query($query);
    
    
    if (!$result) {
        $error .= "Consulta fallida: " . mysql_error();
    }
    
    // Formateo de los datos obtenidos a JSON       
    while ($consulta = mysql_fetch_assoc($result))
      $output [] = $consulta;
      
    echo(json_encode($output));
    
    mysql_free_result($result);
    mysql_close();
    
    // Si no ha habido errores se muestran los resultados. En caso contrario se muestran los errores
    /*if(empty($error)){
        echo $consulta;
    }else {
        echo $error;
    }*/
?>