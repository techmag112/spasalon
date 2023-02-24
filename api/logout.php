<?php
session_start();

if ($_SESSION["auth"] == true) {
    unset($_SESSION["auth"]);
    unset($_SESSION['id']); 
    unset($_SESSION['login']); 
    unset($_SESSION['name']); 
    unset($_SESSION["birthday"]);
    unset($_SESSION["time"]);
    session_destroy();
}