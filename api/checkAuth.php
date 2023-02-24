<?php
session_start(); 

$auth = $_SESSION['auth'] ?? null;
$name = $_SESSION["name"] ?? null;

if ($auth) {
    //$birth = isset($_COOKIE['birth']) ? $_COOKIE['birth'] : null;
    $time = isset($_SESSION["time"]) ? $_SESSION["time"] : date('Y-m-d H:i:s');
    $_SESSION["time"] = date('Y-m-d H:i:s');
    $birth = isset($_SESSION["birthday"]) ? $_SESSION["birthday"] : null;
    //$time = isset($_COOKIE['last']) ? $_COOKIE['last'] : date('Y-m-d H:i:s');
    //setcookie('last', $time, time()+60*60*24*31, '/');
    echo json_encode(array("auth" => true, "name" => $name, "time" => $time, "birth" => $birth) );
} else {
    $_SESSION['auth'] = false;
    echo json_encode(array("auth" => false));
}


