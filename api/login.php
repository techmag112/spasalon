<?php

$_POST = json_decode( file_get_contents("php://input"), true );
$user = $_POST["login"] ?? null;
$password = $_POST["password"] ?? null;

checkAuth($user, $password);

function checkAuth($user, $password) {
    if (checkPassword($user, $password)) {
        session_start();
        $dbUsers = getUsersList();
        $i = existsUser($user); 
        $_SESSION["auth"] = true;
        $_SESSION['id'] = $i; 
        $_SESSION['login'] = $user; 
        $_SESSION['name'] = getCurrentUser($i, $dbUsers) ?? 'Незнакомец'; 
        $name = $_SESSION['name'];
        $_SESSION["birthday"] = $dbUsers[$i]["birthday"];
        $birth = $_SESSION["birthday"];
        //$birth = isset($_COOKIE['birth']) ? $_COOKIE['birth'] : $dbUsers[$i]["birthday"];
        //setcookie('birth', $birth, time()+60*60*24*31, '/');
        $time = isset($_SESSION["time"]) ? $_SESSION["time"] : date('Y-m-d H:i:s');
        $_SESSION["time"] = date('Y-m-d H:i:s');
        //$time = isset($_COOKIE['last']) ? $_COOKIE['last'] : date('Y-m-d H:i:s');
        //setcookie('last', $time, time()+60*60*24*31, '/');
        
        echo json_encode( array("auth" => true, "user" => $user, "name" => $name, "birth" => $birth, "time" => $time ) );
    } else 
    {
        echo json_encode( array("auth" => false) );
        header("HTTP/1.0 403 Forbidden");
    }
}

function getUsersList() {
    return json_decode( file_get_contents('settings.json'), true );
}

function existsUser($login) {
    $dbUsers = getUsersList();
    $foundIndex = false;
    foreach ($dbUsers as $index => $value) {
        if (is_array($value)) {
            if (($i = array_search($login, $value)) !== false) {
                $foundIndex = $index;
            }
        }
    }
    return $foundIndex;
}

function checkPassword($login, $password) {
    $dbUsers = getUsersList();
    $index = existsUser($login);
    if ($index !== false) {
        if (password_verify($password, $dbUsers[$index]["password"])) {
            return true;
        }
    }
    return false;
}

function getCurrentUser($i, $arr) {
    return $arr[$i]["name"] ?? null;
}


