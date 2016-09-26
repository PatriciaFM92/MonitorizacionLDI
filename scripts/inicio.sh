#!/bin/bash
sleep 30
midori -a http://163.117.170.79/monitorizacion/proximasClases.php http://163.117.170.79/monitorizacion/servidores1.php http://163.117.170.79/monitorizacion/servidores2.php &
sleep 30
xdotool search --class midori key 'F11'
