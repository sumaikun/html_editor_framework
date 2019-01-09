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
		$ajax = new MailController($request);
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
		$ajax = new MailController($request);

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


class MailController
{
	function __construct($request){		
			$this->request = $request;
			
	}


	public function test()
	{
		return array("status"=>"OK","message"=>"Prueba exitosa");
	}

	public function send_email()
	{
		require_once($_SERVER["DOCUMENT_ROOT"]."/Framework/ServerSide/Libraries/PHPMailer-master/PHPMailerAutoload.php");

		$mail_config = require_once($_SERVER["DOCUMENT_ROOT"]."/Framework/ServerSide/config/mail_config.php");

		$mail = new PHPMailer;
		

		foreach($mail_config as $key => $value)
		{
			$mail->$key = $value;	
		}
		
		$mail->isSMTP();

		$mail->setFrom($this->request->fromMail,$this->request->fromTitle);
	
		$recipients =explode(';',$this->request->destinatary);
	
	
	
		for($i=0;$i<count($recipients);$i++)
		{
			$recipient = explode(',',$recipients[$i]);

			//La segunda coma es para personalizar el titulo de contacto en el envio ejemplo: jesusvega@col,Jesus Vega
			
			if(isset($recipient[0]) and isset($recipient[1]))
			{ 
				
				$mail->addAddress($recipient[0],$recipient[1]);
			}
			else{
				
				$mail->addAddress($recipient[0]);
			}
		}
	
		if(isset($this->request->withCopyto))
		{
			$CCS=explode(';',$this->request->withCopyto);
			for($i=0;$i<count($CCS);$i++)
			{
				$Cc=explode(',',$CCS[$i]);			
				if($Cc[1]){
					$mail->addCC($Cc[0],$Cc[1]);
				} 
				else
				{
					$mail->addCC($Cc[0]);
				}
			}
		}
	
		/*if($mail_object->files)
		{
			
			$Files = explode(';',$mail_object->files);
			
			for($i=0;$i<count($Files);$i++)
			{
				$attached = explode(',',$Files[$i]);
				
				if(@is_file($attached[0]) && strlen($attached[0])>0)
				{
					//echo "is file";
					if(isset($attached[1]))
					{
						$mail->addAttachment($attached[0], $attached[1]);	
					}
					else
					{
						$mail->addAttachment($attached[0]);
					}
				}
					
			}
		}*/
	
	
	

	
		$mail->isHTML(true);
		$mail->Subject = utf8_decode($this->request->subject);
		$mail->Body = utf8_decode($this->request->content);
		


		//print_r($mail);

		//exit;
		
		if(!$mail->send()) {
	    //echo 'Message could not be sent.';
	    //echo '<br>Mailer Error: '.$mail->ErrorInfo.' <br>';
			$response = array("status"=>"ERROR","desc"=>"Mailer Error: ".$mail->ErrorInfo);
			
		} else {
			$response = array("status"=>"OK","desc"=>"Mensaje Enviado");
			//echo 'Message has been sent';
		}

		return $response;

	}


}
