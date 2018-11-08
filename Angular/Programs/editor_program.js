angular.module("editor_module",["restful_module"]).factory('RequestInterceptor',[function() {  
    var RequestInterceptor = {
        response: function(response) {
            //console.log(response);            
                          
            return response;
        },
        responseError:function(response) {
            console.log(response);            
            if (response.status == 500){                
                swal({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Something went wrong!',
                  footer: '<a href>Why do I have this issue?</a>'
                });
        
            }              
            return response;
        } 
    };
    return RequestInterceptor;
}]).config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('RequestInterceptor');
}]).controller('ImageController',['$scope','RestfulService'
    ,function($scope,RestfulService){       

        $scope.images = {};

        $scope.view = 'Angular/Views/Gallery/gallery.html';

        $scope.style = "transform: scale(0.75); margin-left:-15%;";

        $scope.options = [{key:"Copy",icon:"fa fa-copy",title:"Copiar"},{key:"Upload",icon:"fas fa-upload",title:"Subir Imagen"},{key:"Delete",icon:"fas fa-trash",title:"Borrar"}];

        $scope.load_images = function()
        {
            RestfulService.launch({Acc:"get_images"}).then(function(response){
                $scope.images = response.data.images;
                swal(
                  'Imagenes Cargadas',
                  '',
                  'success'
                );
                init_carousel();
            });
        }

        $scope.load_from_folder = function()
        {
           let folder_to_add = $("input[name='folder_to_add']").val();
            console.log(folder_to_add.length);
            if(folder_to_add.length <= 2)
            {
                swal({
                  type: 'error',
                  title: 'Oops...',
                  text: 'Debe ingresarse una carpeta valida',
                  footer: ''
                });
            }
            else
            {
                RestfulService.launch({Acc:"get_images",route:folder_to_add}).then(function(response){
                    if(response.data.status == 2)
                    {
                        swal({
                          type: 'error',
                          title: 'Oops...',
                          text: 'No existe la carpeta buscada',
                          footer: ''
                        });         
                    }
                    else{
                        $scope.images = response.data.images;
                        swal(
                          'Imagenes Cargadas',
                          '',
                          'success'
                        );
                        init_carousel();       
                    }
                });
            }          
        }

        $scope.move_jquery_carousel = function(id_selector)
        {             
            try {
                $('#myCarousel').carousel(parseInt(id_selector));
            } catch (e) {
                console.log('failed!', e);
            }
        }

        $scope.exec_option = function(option){
            console.log(option);
            switch(option)
            {
                case "Upload":
                    upload();
                    break;
                                   
                default:
                    swal(
                      'The Internet?',
                      'That thing is still around?',
                      'question'
                    )
            }
        }

        async function upload()
        {
            try
            {            
                const {value: file} = await swal({
                  title: 'Select image',
                  input: 'file',
                  inputAttributes: {
                    'accept': 'image/*',
                    'aria-label': 'Upload your profile picture'
                  }
                })
                //console.log(file);
                if (file) {
                  const reader = new FileReader
                  reader.onload = (e) => {
                    swal({
                      title: 'Your uploaded picture',
                      imageUrl: e.target.result,
                      imageAlt: 'The uploaded picture'
                    })
                  }
                  reader.readAsDataURL(file);

                   var data = {file:file,Acc:"save_image"};
                    
                   RestfulService.by_form(data).then(function(response){
                        if(response.data.STATUS == "OK")
                        {
                            $scope.load_images();
                        }
                        else
                        {
                            swal({
                              type: 'error',
                              title: 'Oops...',
                              text: 'Something went wrong!',
                              footer: '<a href>Why do I have this issue?</a>'
                            });
                        }
                   }); 

                    


                }

            }catch(err) { console.log(err); }
                  
        }

        //Transform data

        $scope.change_picture = function(){
            var element = $("#myCarousel .active").find('img');
            html_control.actions.replace_image(element);
        }


        $scope.save_document = function(url,html){
          return RestfulService.launch({Acc:"save_document",url:url,html:html});
        }

        $scope.create_document = function(url,html){
          return RestfulService.launch({Acc:"create_document",url:url});
        }


}]).controller('StylesController',['$scope','RestfulService'
    ,function($scope,RestfulService){
      
      $scope.copy_stylesheets = function(reference_style){
          return  RestfulService.launch({Acc:"copy_stylesheets",style_to_copy:reference_style});
      }  

      $scope.modify_styles = function(css)
      {
        console.log(css);
         return  RestfulService.launch({Acc:"update_stylesheet",style_to_update:css});
      }

}]);


