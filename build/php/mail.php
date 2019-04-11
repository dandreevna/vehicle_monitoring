<?php

if (isset($_POST["name"]) && isset($_POST["phonenumber"]) && isset($_POST["mail"]) && isset($_POST["message"]) ) { 

    $to = "dandreevna@mail.ru";
    $subject = "Сайт мониторинг транспорта: ЗАЯВКА";
    
    $message = "Имя: " . $_POST["name"] . "\r\n";
    $message .= "Телефон: " . $_POST["phonenumber"] . "\r\n";
    $message .= "Mail: " . $_POST["mail"] . "\r\n";
    $message .= "Сообщение: " . $_POST["message"];
    
    $retval = mail ($to,$subject,$message);
    
    if( $retval == true ) {
     	$result = array(
	    	'name' => $_POST["name"],
	    	'phonenumber' => $_POST["phonenumber"]
	     ); 
    }else{
    	$result = array(
	    	'name' => 0,
	    	'phonenumber' => $_POST["phonenumber"]
	    ); 
    }

    echo json_encode($result);
}

if (isset($_POST["user"]) && isset($_POST["phone"]) ) { 

    $to = "dandreevna@mail.ru";
    $subject = "Сайт мониторинг транспорта: ЗВОНОК";
    
    $message = "Имя: " . $_POST["user"] . "\r\n";
    $message .= "Телефон: " . $_POST["phone"];
    
    $retval = mail ($to,$subject,$message);
    
    if( $retval == true ) {
     	$result = array(
	    	'name' => $_POST["user"],
	    	'phonenumber' => $_POST["phone"]
	     ); 
    }else{
    	$result = array(
	    	'name' => 0,
	    	'phonenumber' => $_POST["phonenumber"]
	    ); 
    }

    echo json_encode($result);
}

?>
