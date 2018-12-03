angular.module("restful_module",[]).factory('RestfulService',RestfulService);
	
RestfulService.$inject = ["$http"];    


function RestfulService($http) {

	var rest = {};

	rest.launch = function(data)
	{
		return $http.post("ServerSide/ComponentController.php",data);	
	}

	rest.launch_to_program = function(data)
	{
		return $http.post("ServerSide/ProgramController.php",data);	
	}	

	rest.by_form = function(data)
	{

		var formdata = new FormData();

		angular.forEach(data, function(value, key) {
		 	formdata.append(key,value);
		});

		return $http.post("ServerSide/ComponentController.php", formdata, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}

        })
	}
	
	return rest;
}
				
