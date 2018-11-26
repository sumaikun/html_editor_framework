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
		$ajax = new ComponentController($_REQUEST);
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
		$ajax = new ComponentController($request);

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


class ComponentController
{

	function __construct($request){		
			$this->request = $request;
			
	}

	public function get_images($request)
	{
		$images_saved = array(); 
		
		if(isset($request->route))
		{
			$dir = $request->route;		
		}
		else
		{
			$dir = '/Framework/Images';
		}	

		

		if ($handle = opendir($_SERVER["DOCUMENT_ROOT"].$dir)) {

		    while (false !== ($entry = readdir($handle))) {

	        if ($entry != "." && $entry != "..") {
	        		if(strpos($entry,'.jpg') or strpos($entry,'.png') or strpos($entry,'.bmp') or strpos($entry,'.svg'))
        			{ 
	        			array_push($images_saved, $dir."/".$entry);
		        	}
		        }
		    }

		    closedir($handle);
		}
		else
		{
			return array("status"=>2,"desc"=>"No existe la carpeta");
		}

		return array("status"=>1,"images"=>$images_saved);
	}

	public function save_image()
	{

		if(isset($this->request["route"]))
		{
			$dir = $_SERVER["DOCUMENT_ROOT"].$this->request["route"];		
		}
		else
		{
			$dir = '../Images';
		}			
		
		//echo $dir;

		$target = $dir."/".$_FILES['file']['name'];

		if(move_uploaded_file( $_FILES['file']['tmp_name'], $target))
		{
			return array("status"=>1,"STATUS"=>"OK");		
		}
		else{return array("status"=>2,"STATUS"=>"ERROR");}

	}


	public function delete_image($request)
	{
		unlink($_SERVER["DOCUMENT_ROOT"].$request->image); 
	}

	public function create_document()
	{
		$dir =  $this->request->url;
		if(file_exists($_SERVER["DOCUMENT_ROOT"].'/'.$dir))
		{	
			return array("status"=>2,"desc"=>"File already exists");
		}
		else
		{
			$myfile = fopen($_SERVER["DOCUMENT_ROOT"].'/'.$dir, "w") or die("Unable to open file!");

			copy($_SERVER["DOCUMENT_ROOT"].'/Framework/Core/views/basic_html_template.html', $_SERVER["DOCUMENT_ROOT"].'/'.$dir);

			return array("status"=>1,"desc"=>"file created");
		}	
	}


	public function save_document()
	{
		$dir =  $this->request->url;

		$html = $this->request->html;
		
		file_put_contents($_SERVER["DOCUMENT_ROOT"].$this->request->url, $html);	
		
	    return array("status"=>1);

	}


	public function copy_stylesheets($request)
	{

		if($request->style_to_copy->style == "fdb-block")
		{

			$path_to_copy = $_SERVER["DOCUMENT_ROOT"]."/".$request->style_to_copy->folder.'/css/froala_blocks.css';

			if (!file_exists($path_to_copy)) {
			   copy($_SERVER["DOCUMENT_ROOT"].'/Framework/blocks/css/froala_blocks.css', $path_to_copy);
			}
			
			return array("status"=>1);
		}

		if($request->style_to_copy->style == "content-block")
		{
						
			if($request->style_to_copy->reference == "virb")
			{
				$path_to_copy = $_SERVER["DOCUMENT_ROOT"]."/".$request->style_to_copy->folder.'/css/template_virb.css';

				if (!file_exists($path_to_copy)) {
					copy($_SERVER["DOCUMENT_ROOT"].'/Framework/custom_blocks/css/template_virb.css', $path_to_copy);
				}
					
				$path_to_copy = $_SERVER["DOCUMENT_ROOT"]."/".$request->style_to_copy->folder.'/css/template_virb.min.css';

				if (!file_exists($path_to_copy)) {
					copy($_SERVER["DOCUMENT_ROOT"].'/Framework/custom_blocks/css/template_virb.min.css', $path_to_copy);
				}
					
				$path_to_copy = $_SERVER["DOCUMENT_ROOT"]."/".$request->style_to_copy->folder.'/js/template_virbmain.min.js';

				if (!file_exists($path_to_copy)) {
					copy($_SERVER["DOCUMENT_ROOT"].'/Framework/custom_blocks/js/template_virbmain.min.js', $path_to_copy);
				}

				$path_to_copy = $_SERVER["DOCUMENT_ROOT"]."/".$request->style_to_copy->folder.'/js/template_virbscripts.min.js';
				if (!file_exists($path_to_copy)) {
					copy($_SERVER["DOCUMENT_ROOT"].'/Framework/custom_blocks/js/template_virbscripts.min.js', $path_to_copy);
				}
			}
			else
			{
				$scrip_tag = false;
				$path_to_copy = $_SERVER["DOCUMENT_ROOT"]."/".$request->style_to_copy->folder.'/css/'.$request->style_to_copy->reference.'.css';

				if(file_exists($_SERVER["DOCUMENT_ROOT"].'/Framework/custom_blocks/css/'.$request->style_to_copy->reference.'.css')){ 

					if (!file_exists($path_to_copy)) {
						copy($_SERVER["DOCUMENT_ROOT"].'/Framework/custom_blocks/css/'.$request->style_to_copy->reference.'.css', $path_to_copy);
					}
				}
				else{
					return array("status"=>2,"desc"=>"No exists");
				}


				if(file_exists($_SERVER["DOCUMENT_ROOT"].'/Framework/custom_blocks/js/program_'.$request->style_to_copy->reference.".js"))
				{
					$path_to_copy_program = $_SERVER["DOCUMENT_ROOT"]."/".$request->style_to_copy->folder.'/js/program_'.$request->style_to_copy->reference.'.js';

					if (!file_exists($path_to_copy)) {
						copy($_SERVER["DOCUMENT_ROOT"].'/Framework/custom_blocks/js/program_'.$request->style_to_copy->reference.".js", $path_to_copy_program);
						$scrip_tag = true;
					}
				}

				return array("status"=>1,"script_tag"=>$scrip_tag);	
			}
			
		}
		
	}


	public function update_stylesheet($request)
	{
		$css = $this->request->style_to_update->css;
		file_put_contents($_SERVER["DOCUMENT_ROOT"]."/".$this->request->style_to_update->route, $css);
	}


	public function add_media_query_properties($request)
	{
		$dir =  $this->request->proyect_folder;
		
		if(file_exists($_SERVER["DOCUMENT_ROOT"].'/'.$dir.'/css/media_query.css'))
		{	
			return array("status"=>2,"desc"=>"File already exists");
		}
		else
		{
			copy($_SERVER["DOCUMENT_ROOT"].'/Framework/Core/css/media_query.css',$_SERVER["DOCUMENT_ROOT"].'/'.$dir.'/css/media_query.css');			

			return array("status"=>1,"desc"=>"file created");
		}	
	}


	
}





?>