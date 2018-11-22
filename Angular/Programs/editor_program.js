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

        $scope.gallery_mode = null;

        $scope.images = {};

        $scope.view = 'Angular/Views/Gallery/gallery.html';

        $scope.style = "transform: scale(0.75); margin-left:-15%;";

        $scope.options = [{key:"Copy",icon:"fa fa-copy",title:"Copiar"},{key:"Upload",icon:"fas fa-upload",title:"Subir Imagen"},{key:"Delete",icon:"fas fa-trash",title:"Borrar"}];

        $scope.load_images = function()
        {
            if($("input[name='folder_to_add']").val().length > 0)
            {                  
                return $scope.load_from_folder();
            }

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

        $scope.delete_image = function()
        {
            swal({      
                  title: decode_utf8('¡Esta seguro de borrar la imagen!'),
                  text: decode_utf8('Después de eliminada la imagen no podrá recuperarse'),
                  type: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'Si, !adelante!'     
                }).then((result) => {
                  let element = $("#myCarousel .active").find('img');
                  RestfulService.launch({Acc:"delete_image",image:element.attr("src")}).then(function(response){
                      $scope.load_images();                 
                      $("div.ng-scope.item").first().addClass("active");
                  });
                  
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
                        $("input[name='folder_added']").val($("input[name='folder_to_add']").val());       
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
                case "Delete":
                    $scope.delete_image();
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

                  if($("input[name='folder_added']").val().length > 0)
                  {                  
                      var data = {file:file,Acc:"save_image",route:$("input[name='folder_to_add']").val()};
                  }
                  else
                  {
                     var data = {file:file,Acc:"save_image"};
                  }                   
                    
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
            let element = $("#myCarousel .active").find('img');
            html_control.actions.replace_image(element);
        }

        $scope.change_background = function(){
            let element = $("#myCarousel .active").find('img');
            html_control.actions.change_background_image(element); 
        }

        $scope.change_ico = function(){
            let element = $("#myCarousel .active").find('img');
            html_control.actions.change_page_ico(element); 
        }

        $scope.insert_picture = function(){
            let element = $("#myCarousel .active").find('img');
            html_control.actions.insert_image(element); 
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

      $scope.add_media_query_properties = function(proyect_folder)
      {
        console.log("launch media query instruction "+proyect_folder);
          return  RestfulService.launch({Acc:"add_media_query_properties",proyect_folder:proyect_folder}); 
      }

}]);


