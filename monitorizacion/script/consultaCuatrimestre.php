<?php
    // Parametros para conexion con base de datos
    $db_host = '';
    $db_user = '';
    $db_pwd = '';
            
    $database = '';

    $error = '';
    
    // Conexion con base de datos        
    if (!mysql_connect($db_host, $db_user, $db_pwd))
        $error = "No se puede conectar con la base de datos: " . mysql_error() . "<br>";
            
    if (!mysql_select_db($database))
        $error .= "No se puede seleccionar la tabla: " . mysql_error() . "<br>";
            
    // Envio de consulta SQL
    mysql_query("SET NAMES 'utf8'");
    
    $query="SELECT * FROM reservas_opciones WHERE (nombre='cuatrimestre1_ini' OR nombre='cuatrimestre1_fin' OR nombre='cuatrimestre2_ini' OR nombre='cuatrimestre2_fin')";
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