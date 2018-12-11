<?php

set_error_handler("customError");

function customError($errno, $errstr , $errfile , $errline) {
	header("HTTP/1.1 500 Internal Server Error");
	$error_message = "$errno $errstr";
	$error_message .="  Fatal error on line $errline in file $errfile";
	echo json_encode(array("status"=>2,"error_message"=>$error_message));
	exit;

}
//set error handler



if($_REQUEST)
{
	if(isset($_REQUEST['Acc']))
	{		
		$ajax = new LoginController($_REQUEST);
		$data = $_REQUEST['Acc'];		
		$response = $ajax->$data();
		echo json_encode($response);
	}

}
else
{
	//echo "GOT HERE ".$_SERVER['REQUEST_METHOD'];
	$request_body = file_get_contents('php://input');
	if($request_body)
	{
		$request = json_decode($request_body);	
		$ajax = new LoginController($request);

		if($request->Acc != null)
		{
			$acc = $request->Acc;
			$response = $ajax->$acc($request); 
		}
		else
		{
			switch ($_SERVER['REQUEST_METHOD']) {
		    case "POST":
		        $response = $ajax->create($request->table);
		        break;
		    case "PUT":		    	
		        $response = $ajax->persist($request->table);
		        break;
		    case "DELETE":
		    	//echo "here";
		        $response = $ajax->delete($request->table);
		        break;
			}	
		}

		echo json_encode($response);
	

		if(json_last_error())
		{ 	
			switch(json_last_error()) {
		        case JSON_ERROR_NONE:
		            //echo ' - Sin errores';
		        break;
		        case JSON_ERROR_DEPTH:
		            echo ' - Excedido tamaño máximo de la pila';
		        break;
		        case JSON_ERROR_STATE_MISMATCH:
		            echo ' - Desbordamiento de buffer o los modos no coinciden';
		        break;
		        case JSON_ERROR_CTRL_CHAR:
		            echo ' - Encontrado carácter de control no esperado';
		        break;
		        case JSON_ERROR_SYNTAX:
		            echo ' - Error de sintaxis, JSON mal formado';
		        break;
		        case JSON_ERROR_UTF8:
		            echo ' - Caracteres UTF-8 malformados, posiblemente codificados de forma incorrecta';
		        break;
		        default:
		            echo ' - Error desconocido';
		        break;
		    }
		}    


	}    	
	

}

class LoginController
{

	function __construct($request){
		if(is_array($request))
		{
			$request = (object) $request;
		}		
		
		$this->request = $request;	
			
	}


	public function login()
	{


		$lifetime = strtotime('+15 minutes', 0);

		session_set_cookie_params($lifetime);

		session_start();	

		//print_r($_SESSION);

		$_SESSION["USER"] = $this->request->email;
		return array("status"=>"OK"); 
	}


	public function check_session()
	{
		session_start();
		if(!isset($_SESSION["USER"]))
		{
			return array("status"=>"NO SESSION");
		}
		else{
			return array("status"=>"OK");	
		}
	}

}	