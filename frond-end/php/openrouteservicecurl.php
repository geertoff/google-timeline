<?php
// LET OP!!!!!
// Voor het gebruik van de CURL functies moet de CURL extensie aangezet worden in PHP.INI
$routesoort = $_POST["routesoort"];
$url = 'https://api.openrouteservice.org/v2/directions/'.$routesoort.'/geojson';
$apikey = '5b3ce3597851110001cf62483c392c6c859141bfbb7984054b39d14e';  // vul hier je eigen apikey in
$postfields = $_POST['sendPost'];
$ch = curl_init(); 
// set url 
curl_setopt($ch, CURLOPT_URL, $url); 
//return the transfer as a string 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
// for accessing https
curl_setopt($ch, CURLOPT_CAINFO, 'cacert.pem');
// apply api key
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Accept: application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
    "Authorization: $apikey",
    "Content-Type: application/json; charset=utf-8"
  ));
// add post data
curl_setopt($ch, CURLOPT_POSTFIELDS, "$postfields");
// $output contains the output string 
$output = curl_exec($ch); 
// close curl resource to free up system resources 
curl_close($ch);      
echo $output;
?>
