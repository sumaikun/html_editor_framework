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
		$request = (object) $_REQUEST;
		$ajax = new ProgramController($request);
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
		$ajax = new ProgramController($request);

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
	}    	
	

}


class ProgramController
{
	function __construct($request){		
			$this->request = $request;
			
	}


	function get_json_properties()
	{
		if(file_exists($_SERVER["DOCUMENT_ROOT"]."/".$this->request->fullfilepath))
		{
			$json_file = file_get_contents($_SERVER["DOCUMENT_ROOT"]."/".$this->request->fullfilepath);
			if($json_file)
			{ 	
				//echo $json_file;
				$json_data = json_decode($json_file);
				//$json_data = $json_file; 
				return array("STATUS"=>"OK","json_data"=>$json_data);
			}
		}
		else
		{
			return array("STATUS"=>"FILE NO EXIST");
		}
	}


	function save_json_to_server()
	{
		//echo json_encode($this->request->json_to_save);
		if(file_exists($_SERVER["DOCUMENT_ROOT"]."/".$this->request->fullfilepath))
		{
			$data_to_save = json_encode($this->request->json_to_save);
			if(file_put_contents($_SERVER["DOCUMENT_ROOT"]."/".$this->request->fullfilepath,$data_to_save))
			{
				return array("STATUS"=>"OK");		
			}
		}
		else
		{
			return array("STATUS"=>"FILE NO EXIST");
		}	
		
	}


	function get_rand_pictures()
	{
		if(file_exists($_SERVER["DOCUMENT_ROOT"]."/".$this->request->folder_path))
		{
			$images_got = array();

			if ($handle = opendir($_SERVER["DOCUMENT_ROOT"]."/".$this->request->folder_path))
			{

			    while (false !== ($entry = readdir($handle))) {

		        if ($entry != "." && $entry != "..") {
		        		if(strpos($entry,'.jpg') or strpos($entry,'.png') or strpos($entry,'.bmp') or strpos($entry,'.svg'))
	        			{ 
		        			array_push($images_got, $this->request->folder_path."/".$entry);
			        	}
			        }
			    }

			    closedir($handle);
			}
			$random_indexes = array_rand($images_got,$this->request->n_pictures);
			
			$images = array();

			foreach($random_indexes as $random_index)
			{
				array_push($images, $images_got[$random_index]);
			}

			return array("STATUS"=>"OK","images"=>$images);		
			
		}
		else
		{
			return array("STATUS"=>"FILE NO EXIST");
		}
		
	}


}
