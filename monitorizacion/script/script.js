// JavaScript Document

/*Variables globales que almacenan las aulas y servidores a monitorizar*/
var aulas;
var servidores;

$(document).ready(function(){

    //prueba();
    /*Lectura de ficheros de configuracion de aulas y servidores*/
    definicionAulas();
    definicionServidores();
    
    /*Comienzo de ejecucion de las funciones encargadas de la monitorizacion*/
	if(document.getElementById("proximasClases") != null){ // Pestaña de clases
       crearDivAulas(); /*Se crean los DIV correspondientes a cada aula para poner las proximas clases*/
	     consultaClases();
	     setInterval(consultaClases, 900000); /*Cada 15 minutos*/
           
	} else { // Pestañas de servidores
      consultaClases();
		  estadoServidores();
		
		  setInterval(consultaOcupacionGeneral,900000); /*Cada 15 minutos*/
		  setInterval(estadoServidores,30000); /*Cada medio minuto*/
	}
  
});


/**************** FUNCIONES BASE *****************/

/*
 * Funcion que calcula la fecha actual en el formato yyyy-mm-dd
 */
 function obtenerFechaActual(){
     var f = new Date();
     var fecha=f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate();
     return fecha;
 } /*Fin function obtenerFechaActual()*/
 
/*
 * Funcion que calcula la hora actual en el formato hh:mm:ss y en formato 24h (0 a 23)
 */
 function obtenerHoraActual(){
     var f = new Date();
     var hora=f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds();
     return hora;
 } /*Fin function obtenerHoraActual()*/
 
 /*
 * Funcion que calcula el dia de la semabna actual (de Lunes a Domingo)
 */
 function obtenerDiaActual(){
     var diasSemana = new Array("Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado");
     var f = new Date();
     var dia=diasSemana[f.getDay()];
     return dia;
 } /*Fin function obtenerDiaActual()*/
 
 /*
 * Funcion que calcula el cuatrimestre en funcion de la fecha actual y las fechas de inicio y fin de los cuatrimestres
 */
 function obtenerCuatrimestreActual(){
      var cuatrimestre=0;
      var fecha_actual=quitarPrincipio(obtenerFechaActual(),5); /*Fecha actual sin año, solo mes y dia*/
      fecha_actual=fecha_actual.split("-"); /*Array con la fecha actual separada por mes y dia*/

      /*Variables para almacenar las fechas de inicio y fin de los cuatrimestres*/     
      var cuatri1_ini, cuatri1_fin, cuatri2_ini, cuatri2_fin;

      var urlAux = "http://163.117.170.79/monitorizacion/script/consultaCuatrimestre.php";
      
      /*Se obtiene el fichero JSON con la consulta a la Base de Datos */
      $.ajax({
          dataType: 'json',
          async: false,
          url: urlAux,
          Connection: close,
          success: function(datos) {
                /*Variables para extraer los datos del objeto JSON*/                 
                var nombre, valor;
                 
                /*Si el objeto JSON contiene datos (no esta vacio)...*/
                if(datos!=null){
                    /*Se recorren una a una las tuplas de datos*/
                    for (var i=0; i<datos.length; i++) {
                        /*Se extrae la información de cada tupla*/
                        nombre=datos[i].nombre;
                        valor=datos[i].valor;
                        
                        /*Se almacena cada fecha en la variable declarada anteriormente para esta finalidad y se transforma de un string de la forma mes/dia a un array con 
                        el mes y el dia separados (mes posicion 0 y dia posicion 1)*/
                        if(nombre=="cuatrimestre1_ini"){
                            cuatri1_ini = valor;
                            cuatri1_ini = cuatri1_ini.split("/"); /*Array con el mes y el dia*/
                        }else if(nombre=="cuatrimestre1_fin"){
                             cuatri1_fin = valor;
                             cuatri1_fin = cuatri1_fin.split("/"); /*Array con el mes y el dia*/
                        }else if(nombre=="cuatrimestre2_ini"){
                             cuatri2_ini = valor;
                             cuatri2_ini = cuatri2_ini.split("/"); /*Array con el mes y el dia*/
                        }else if(nombre=="cuatrimestre2_fin"){
                             cuatri2_fin = valor;
                             cuatri2_fin = cuatri2_fin.split("/"); /*Array con el mes y el dia*/
                        }/*Fin if-else*/
                    } /*Fin bucle for*/
                } /*Fin primer if*/   
          },
          error: function() { //alert("Error leyendo fichero jsonP de BBDD"); 
          }
      });
      
      /*Comparacion de fecha actual con fechas de cuatrimestre*/
      /*Los arrays con las fechas tienen el mes en la posicion 0 y el dia en la posicion 1. Puesto que estan almacenados como un string se pasa a int para compararlos
        con parseInt. Se compara que el mes y el dia de la fecha actual sean mayores o iguales que los del inicio de los cuatrimestres y menores o iguales que los del
        fin de cuatrimestre*/
       
       /*Si no ha habido error a la hora de leer las fechas de la base de datos...*/  
       if(cuatri1_ini != null && cuatri1_fin != null && cuatri2_ini != null && cuatri2_fin != null){
           
           /*Comparacion mes primer cuatrimestre*/
           if((parseInt(cuatri1_ini[0])<=parseInt(fecha_actual[0])) && (parseInt(cuatri1_fin[0])>=parseInt(fecha_actual[0]))){
               /*Comparacion dia primer cuatrimestre*/
               if((parseInt(cuatri1_ini[1])<=parseInt(fecha_actual[1])) && (parseInt(cuatri1_fin[1])>=parseInt(fecha_actual[1]))){
                   cuatrimestre=1; /*Se establece que el cuatrimestre actual es el primero*/
                }
            }
            /*Comparacion mes segundo cuatrimestre*/
            else if((parseInt(cuatri2_ini[0])<=parseInt(fecha_actual[0])) && (parseInt(cuatri2_fin[0])>=parseInt(fecha_actual[0]))){
                /*Comparacion dia segundo cuatrimestre*/
                //if((parseInt(cuatri2_ini[1])<=parseInt(fecha_actual[1])) && (parseInt(cuatri2_fin[1])>=parseInt(fecha_actual[1]))){
                if((parseInt(cuatri2_ini[1])<=parseInt(fecha_actual[1])) && ((parseInt(cuatri2_fin[1])+1)>=parseInt(fecha_actual[1]))){
                    cuatrimestre=2; /*Se establece que el cuatrimestre actual es el segundo*/
                }
            }
        }
     return cuatrimestre;
 } /*Fin function obtenerCuatrimestreActual()*/

 /*
 * Funcion que elimina del principio de una cadena el numero de digitos especificados por numCaracteres
 */
 function quitarPrincipio(cadena, numCaracteres){
     var newCadena = "";
     newCadena=cadena.substring(numCaracteres,cadena.length);
     
     return newCadena;
 } /*Fin function quitarPrincipio()*/
 
 /*
 * Funcion que elimina del final de una cadena el numero de digitos especificados por numCaracteres
 */
 function quitarFinal(cadena, numCaracteres){
     var newCadena = "";
     newCadena=cadena.substring(0,cadena.length-numCaracteres);
     
     return newCadena;
 } /*Fin function quitarFinal()*/
 
 /*
 * Funcion que lee un fichero de configuracion para definir las aulas que se desea monitorizar
 */
 function definicionAulas(){
     
     /*Se obtiene el fichero JSON con las aulas*/
     $.ajax({
          dataType: 'json',
          async: false,
          url: 'http://163.117.170.79/monitorizacion/config/aulas_def.json',
          Connection: close,
          success: function(datos) {
         
             /*Se declara el array de aulas con las posiciones necesarias (una por aula)*/
             aulas = new Array (datos.length);
         
             /*Se recorren una a una las instancias del objeto JSON y se almacena su valor en el array de aulas*/
             for (var i=0; i<datos.length; i++) {
                 aulas[i]=datos[i].aula;
             } /*Fin bucle for*/
         },
         error: function() { //alert("Error leyendo fichero jsonP de BBDD"); 
         }
     });
 } /*Fin function definicionAulas()*/
 
 /*
 * Funcion que lee un fichero de configuracion para definir los servidores que se desea monitorizar
 */
 function definicionServidores(){
     
     /*Se obtiene el fichero JSON con los servidores*/
     $.ajax({
          dataType: 'json',
          async: false,
          url: 'http://163.117.170.79/monitorizacion/config/servidores_def.json',
          Connection: close,
          success: function(datos) {
         
             /*Se declara el array de servidores con las posiciones necesarias (una por servidor)*/
             servidores = new Array (datos.length);
             
             /*Se recorren una a una las instancias del objeto JSON y se almacena su valor en el array de servidores*/
             for (var i=0; i<datos.length; i++) {
                 servidores[i]=datos[i].servidor;
             } /*Fin bucle for*/
         },
         error: function() { //alert("Error leyendo fichero jsonP de BBDD"); 
         }
     });
 } /*Fin function definicionServidores()*/
     
/*
 * Funcion que crea los div correspondientes a cada aula en HTML para posteriormente insertar las reservas
 */ 
function crearDivAulas(){

	/*Se realiza una consulta por cada aula*/
     var texto="<table id='tabla_clases'>";
     for(var i=0; i<(aulas.length);i++)
     {
         var aula = aulas[i];
         texto = texto + "<tr>" + 
                         "<td class='titulo'>" + quitarPrincipio(aula,4) + "</td>" + 
                         "<td id=" + aula + " class='texto'>&nbsp;</td>" + 
                         "</tr>";
     } /*Fin primer bucle for*/
     texto=texto + "</table>"; 
     
     /*Se inserta en el objeto HTML correspondiente*/
     if(document.getElementById("proximasClases") != null){
        document.getElementById("proximasClases").innerHTML = texto;
     }
}   /*Fin function crearDivAulas()*/  


/*
 * Funcion que comprueba si una clase esta en curso a partir de la hora de inicio y fin de la clase proporcionadas
 */
 function comprobarClaseEmpezada(h_inicio, h_fin){
 
     /*Se obtiene la hora actual*/
     h_actual=obtenerHoraActual();
              
     /*Se quitan los segundos*/
     h_inicio = quitarFinal(h_inicio, 3);
     h_fin = quitarFinal(h_fin, 3);
     h_actual = quitarFinal(h_actual, 3);
              
     /*Se exraen horas y minutos por separado*/
     hora_inicio=quitarFinal(h_inicio,3);
     minuto_inicio=quitarPrincipio(h_inicio,3);
     hora_fin=quitarFinal(h_fin,3);
     minuto_fin=quitarPrincipio(h_fin,3);
     hora_actual=quitarFinal(h_actual,3);
     minuto_actual=quitarPrincipio(h_actual,3);
     
     /*Si la hora actual es igual a la de inicio, se comprueban minutos para ver si ha empezado la clase*/
     if(hora_inicio==hora_actual && minuto_inicio<=minuto_actual){
          return 1; /*Clase empezada*/
     }
      /*Si la hora actual es mayor que la de inicio y menor que la de fin la clase esta empezada*/
      else if(hora_inicio<hora_actual && hora_fin>hora_actual){
           return 1; /*Clase empezada*/
     
     }
      /*Si la hora actual es igual a la hora de fin se comprueban minutos para ver si ha acabado*/
      else if(hora_fin==hora_actual && minuto_fin>minuto_actual){
           return 1; /*Clase empezada y no acabada*/
     }
      else{
           return 0; /*Clase no empezada o acabada*/
     }
 
 }      
/************** FIN FUNCIONES BASE ***************/



/********** FUNCIONES DE MONITORIZACION **********/

/*
 * Funcion que consulta las proximas reservas de cada una de las 	aulas y llama a las funciones proximasClases y ocupacionGeneral para mostrar la informacion
 */
 function consultaClases(){
 
     /*Variables necesarias para realizar la consulta a la Base de Datos*/
     var cuatrimestre=obtenerCuatrimestreActual();
     var dia=obtenerDiaActual();
     var fecha=obtenerFechaActual();
     var hora_actual=obtenerHoraActual();
     
     /*Se realiza una consulta por cada aula*/
     for(var i=0; i<(aulas.length);i++)
     {
         /*Variables que indican el aula a consultar y el fichero remoto que debe consultarse*/
         var aula = aulas[i];

         var urlAux = "http://163.117.170.79/monitorizacion/script/consultaClases.php?aula=" + aula + "&cuatrimestre=" + cuatrimestre + "&dia=" + dia + "&fecha=" + fecha + "&hora_actual=" + hora_actual;
         
         /*Se obtiene el fichero JSON con la consulta a la Base de Datos */
         $.ajax({
             dataType: 'json',
             async: false,
             url: urlAux,
             Connection: close,
             success: function(datos) {
			 
                        /*Se actualiza la ocupacion general*/
              					ocupacionGeneral(datos);
              					  
                        /*Si es la pestaña de proximas clases se actualizan las proximas clases*/                                                      
              					if(document.getElementById("proximasClases") != null){
              						proximasClases(datos);
              					}
                 
             },
             error: function() { //alert("Error leyendo fichero jsonP de BBDD"); 
             }
          });
      
      } /*Fin primer bucle for*/
  }/*Fin function consultaClases()*/

/*
 * Funcion que consultas las proximas clases que va a haber en un aula y las muestra por pantalla (2 como maximo por aula)
 */
 function proximasClases(datos){

    /*Variables para extraer los datos del objeto JSON*/                 
     var nombre, h_inicio, h_fin, aula;
                 
     /*Si existen clases para ese aula (hay datos), se crea el texto HMTL necesario*/                 
     if(datos!=null){
     var texto = "";
     
     /*Se recorren una a una las tuplas recuperadas hasta un maximo de 2*/
     //for (var j=0; j<datos.length; j++) {
     for (var j=0; j<2; j++) {
      		/*Se extrae la información de cada tupla*/
      		aula=datos[j].a_nombre;
          nombre=datos[j].nombre;
      		h_inicio=datos[j].hora_inicio;
      		h_fin=datos[j].hora_fin;
                               
      		/*Se elimina el final de la hora para mostrar solo hora y minutos (sin segundos)*/
      		var h_inicio_corta = quitarFinal(h_inicio, 3);
      		var h_fin_corta = quitarFinal(h_fin, 3);
      		
          /*Si la asignatura tiene el nombre muy largo se pone la letra más pequeña*/
          if (nombre.length > 35){
      		    nombre = "<small>" + nombre + "</small>" ;
      		}
      		
         /*Si la clase esta en curso se pinta en rojo*/
          if(comprobarClaseEmpezada(h_inicio, h_fin) == 1){
              texto = texto + "<span style=color:red> " + h_inicio_corta + " - " + h_fin_corta + ": " + nombre + " </span></br>";
          
          }/*Si no esta empezada se pinta en negro*/ 
          else{
      		    texto = texto + "<span style=color:black> " + h_inicio_corta + " - " + h_fin_corta + ": " + nombre + " </span></br>";
          }
     } /*Fin bucle for*/

    if(document.getElementById(aula) != null)
        document.getElementById(aula).innerHTML = texto;
    } /*Fin if*/
         
 } /*Fin function proximasClases()*/


/*
 * Funcion que se encarga de cambiar el color de fondo de las aulas dependiendo de su ocupacion (rojo si hay clase y verde si no la hay)
 */
 function ocupacionGeneral(datos){
 
     /*Variables para extraer los datos del objeto JSON*/
     var h_inicio, h_fin;
     var h_actual;
     var aula;
     
     /*Variables auxiliares para comparar las horas*/
     var hora_inicio, minuto_inicio, hora_fin, minuto_fin;
     var hora_actual, minuto_actual;

    /*Si se ha obtenido alguna tupla de la consulta (hay datos) significa que hay clase en el aula consultada*/                 
    if(datos!=null){
 
        /*Se extrae la información de cada tupla*/
      		    aula=datos[0].a_nombre;
              h_inicio=datos[0].hora_inicio;
      		    h_fin=datos[0].hora_fin;
              
              /*Si la clase esta en curso se pinta el recuadro correspondiente de rojo*/
              if(comprobarClaseEmpezada(h_inicio, h_fin) == 1){
                  if(document.getElementById(quitarPrincipio(aula,4)) != null){
      			            document.getElementById(quitarPrincipio(aula,4)).style.backgroundColor="#FB4235";
                  }
              }
              /*Si la clase no esta en curso se pinta el recuadro de verde*/
              else{
                  if(document.getElementById(quitarPrincipio(aula,4)) != null){
      			            document.getElementById(quitarPrincipio(aula,4)).style.backgroundColor="#4AE616";
                  }
              }
   
    } /*Fin if-else*/
    
 } /*Fin function ocupacionGeneral()*/

/*
 * Funcion que se encarga de cambiar el color de fondo de los servicios dependiendo de su estado(rojo si no esta operativo y verde si funciona correctamente)
 */
 function estadoServicios(){
 
     /*Variable que indica el fichero remoto que debe consultarse*/
     var urlAux = url + "servicios_estadoGeneral.php";
     
     /*Se obtiene el fichero JSON con estado general de los servicios*/
     $.ajax({
         dataType: 'jsonp',
         url: urlAux,
         Connection: close,
         success: function(datos) {
             /*Variables para consultar el servicio y su estado*/
             var servicio;
             var estado;
             
             /*Se recorren uno a uno los servicios*/
             for (var i=0; i<datos.length; i++) {
                 
                 servicio=datos[i].servicio;
                 estado=datos[i].estado;
                 
                 //console.log(i + "/" + datos[i].servicio + "\n");
                 
                 /*Si el servicio funciona correctamente (valor 0) se pone el color de fondo en verde*/
                 if(estado=='0'){
                     document.getElementById(servicio).style.backgroundColor="#4AE616";
                 }/*Si el servicio falla (valor 1) se pone el color de fondo en rojo*/
                 else if(estado=='1'){
                     document.getElementById(servicio).style.backgroundColor="#FB4235";
                 }
             }
         },
         error: function() { //alert("Error leyendo fichero jsonP de estado general de servicios"); 
         }
      });
 
 } /*Fin function estadoServicios()*/
 
/*
 * Funcion que actualiza las imagenes generadas por SmokePing del estado de los servidores
 */
 function estadoServidores(){
 
     var timestamp = new Date().getTime(); /*Variable que se añade a la url para refrescar la imagen*/
     var divID = "infoServidores";
     var texto = "";
     var num = 1;
     
     /*Se actualiza la imagen de todos los servidores contenidos en el array "servidores"*/
     for (i=0; i<(servidores.length);i+=2){
       /*Se crea el texto HTML a insertar*/
       texto = "<p class='nombreServer'>" + servidores[i] + "</p>";
       texto += "<img class='grafica' src='http://163.117.170.79/smokeping/images/Servidores/" + servidores[i] +"_last_3600.png?random=" + timestamp + "'>";
       texto += "<p class='nombreServer'>" + servidores[i+1] + "</p>";
       texto += "<img class='grafica' src='http://163.117.170.79/smokeping/images/Servidores/" + servidores[i+1] +"_last_3600.png?random=" + timestamp + "'>";
       
       /*Se inserta en el objeto HTML correspondiente*/
       if(document.getElementById(divID + num) != null){ 
         document.getElementById(divID + num).innerHTML = texto;
       }
       num++;
     }
 
 } /*Fin function estadoServidores()*/ 
  

/******** FIN FUNCIONES DE MONITORIZACION ********/
 
 
 
 
 
 
 /* 
  * FUNCIONES A MEDIO HACER O EN FASE DE PRUEBAS
 */

 function prueba(){
 
     alert("Servidores");
     
     /*Se obtiene el fichero JSON con los servidores*/
     $.getJSON('http://163.117.170.79/monitorizacion/config/servidores_def.json', function(datos){
         
         /*Se declara el array de aulas con las posiciones necesarias (una por aula)*/
         servidores = new Array (datos.length);
         
         /*Se recorren una a una las instancias del objeto JSON y se almacena su valor en el array de servidores*/
         for (var i=0; i<datos.length; i++) {
             servidores[i]=datos[i].servidor;
             
             alert(i + "/" + datos[i].servidor);
         }
         
         for (var j=0; j<servidores.length; j++) {
             
             alert(servidores[j]);
         }
     });
     
     /*Variable que indica el fichero remoto que debe consultarse*/
     
     
     /*Se obtiene el fichero JSON con estado general de los servicios*/
     /*$.ajax({
         dataType: 'json',
         url: urlAux,
         success: function(datos) {
             var aula;
             var nombre;
             var inicio;
             var fin;
             
             var texto="";
             
             //console.log(datos);
             
             for (var i=0; i<datos.length; i++) {
                 
                 aula=datos[i].aula;
                 //alert('Aula:' + aula);
                 texto=texto + "<div class='clase'><p class='titulo'>" + aula + "</p>";
                 
                 var clases = datos[i].clases;
                 //console.log(clases);
                 
                 //alert('Aula: ' + aula + '\nNumero clases: ' + clases.length);
                     
                 for(var j=0; j<clases.length;j++){
                     nombre=clases[j].nombre;
                     inicio=clases[j].inicio;
                     fin=clases[j].fin;
                     
                      texto=texto + "<p class='texto'>" + inicio + " - " + fin + ": " + nombre + "</p>";
                         
                     //alert('Aula: ' + aula +'\nClase: ' + nombre + '\nInicio: ' + inicio + '\nFin: ' + fin) 
                     //alert(texto); 
                 }
                 
                 texto=texto + "</div>";
                 
             }
             
             if(document.getElementById("proximasClases") != null){
               document.getElementById("proximasClases").innerHTML = texto;
             } 
         },
         error: function() { alert("Error leyendo fichero jsonP de estado general de servicios"); }
      });*/
 
 }
 
 
 
