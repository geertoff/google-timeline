<?php
// LET OP!!!!!
// Voor het gebruik van de CURL functies moet de CURL extensie aangezet worden in PHP.INI
$url = $_POST["url"];
$ch = curl_init(); 
// set url 
curl_setopt($ch, CURLOPT_URL, $url); 
//return the transfer as a string 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
// for accessing https
curl_setopt($ch, CURLOPT_CAINFO, 'cacert.pem');
// set username password
if (isset($_POST['username']) && isset($_POST['password']))
{
    $username = $_POST['username'];
    $password = $_POST['password'];
    curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
}
// $output contains the output string 
$output = curl_exec($ch); 
// close curl resource to free up system resources 
curl_close($ch);      
echo $output;
?>