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
}]).directive('contenteditable', function($timeout) {
    return {
      restrict: "A",
      priority: 1000,
      scope:{ngModel:"="},
      link: function(scope, element) {
        //console.log(scope.ngModel);
        //console.log(element);       
        element.html(scope.ngModel);        
        element.on('focus blur keyup paste input', function() {
          //console.log(scope.ngModel);
          scope.ngModel = element.text();
          if(!scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest')
          {
            scope.$apply();
          }     
          return element;
        });        
      }
    };
  }).directive('timestampToDate', function() {
        return {
            require: 'ngModel',
            link: function(scope, ele, attr, ngModel) {
                console.log('here');
                // converts DOM value to ng-model
                ngModel.$parsers.push(function(value) {
                    return Date.parse(value);
                });

                // converts ng-model to DOM value
                ngModel.$formatters.push(function(value) {
                    var date = new Date(value);
                    return date;
                });
            }
        }
  }).directive("formatDate", function(){
  return {
   require: 'ngModel',
    link: function(scope, elem, attr, modelCtrl) {
      modelCtrl.$formatters.push(function(modelValue){
        return new Date(modelValue);
      })
    }
  }
}).service('parseDate', function() {
      this.default = function (date) {
          return Date.parse(date).toString("yyyy-MM-dd");
      }
    this.expression = function (date,expression) {
          return Date.parse(date).toString(expression);
      }
  }).controller('ImageController',['$scope','RestfulService'
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

      $scope.add_custom_file_from_core = function(proyect_folder,filepath)
      {
        //console.log("launch media query instruction "+proyect_folder);
          return  RestfulService.launch({Acc:"add_custom_file_from_core",proyect_folder:proyect_folder,filepath:filepath}); 
      }

}]).controller('CalendarController',['$scope','RestfulService','parseDate'
    ,function($scope,RestfulService,parseDate){



     function create_modal_for_event(object)
     {  



         let modal_string = '<div class="modal fade calendar_events_modals" id="CalendarContentModal_'+object.id+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
            modal_string += '<div class="modal-dialog modal-dialog-centered modal-lg" role="document">';
            modal_string +=  '<div class="modal-content">';
            modal_string +=   '<div class="modal-header">';
            modal_string +=      '<h5 class="modal-title" id="exampleModalLongTitle">'+object.title+'</h5>';
            modal_string +=      '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
            modal_string +=        '<span aria-hidden="true">&times;</span>';
            modal_string +=       '</button>';
            modal_string +=    '</div>';
            modal_string +=    '<div class="modal-body  to_insert_default_content">';
                  
            modal_string +=    '</div>';
            modal_string +=    '<div class="modal-footer">';
            modal_string +=     '<button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>';            
            modal_string +=    '</div>';
            modal_string +=  '</div>';
            modal_string += '</div>';
            modal_string += '</div>';

            return modal_string
      }

      $scope.modal = {title:"Modal para calendario"} ;

      $scope.calendar_events = [];     

      $scope.show_button_to_save = false;

      $scope.new_event = {};

      $scope.search_file = function(){
        console.log(proyect_folder+"/"+document.querySelector("input[name='json_files_for_events']").value);
        let request = RestfulService.launch_to_program({Acc:"get_json_properties",fullfilepath:proyect_folder+"/"+document.querySelector("input[name='json_files_for_events']").value})  
        request.then(function(response){

            if(response.data.STATUS == "FILE NO EXIST")
            {
               return swal({
                  type: 'error',
                  title: 'Oops...',
                  text: 'El archivo no existe',
                  footer: ''
                });
            }
           //console.log(response.data);
            $scope.calendar_events = response.data.json_data;       
            $scope.show_button_to_save = true;
        });
      }

      $scope.save_json_to_server = function(){

           let interrup = false; 

           $scope.calendar_events.forEach(function(calendar_event){

               

               var d1 = new Date(calendar_event.start);
               var d2 = new Date(calendar_event.end);

               if(d2 < d1 )
                {  
                    alert("Las fechas finales deben ser mayores a las iniciales, verifique e intente nuevamente para guardar"); 
                    interrup = true;
                }
                
               
            });

            console.log($scope.calendar_events);

            if(interrup)
              {return;}

             swal({      
              title: decode_utf8('¿Esta seguro de guardar?'),
              text: decode_utf8('Esto modificara la información de los eventos y si no guardo una copia no podra quitar los cambios'),
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, !adelante!'     
              }).then((result) => {
                if (result.value)
                {

                    let if_folder_proyect = proyect_folder+"/";
                    let request = RestfulService.launch_to_program({Acc:"save_json_to_server",fullfilepath:if_folder_proyect+document.querySelector("input[name='json_files_for_events']").value,json_to_save:$scope.calendar_events})  
                    request.then(function(response){
                       
                       //console.log(response.data);
                       if(response.data.STATUS == "FILE NO EXIST")
                        {
                           return swal({
                              type: 'error',
                              title: 'Oops...',
                              text: 'El archivo no existe',
                              footer: ''
                            });
                        }
                        else{
                          editor_html.find(".calendar_events_modals").modal("hide");
                          editor_html.find(".calendar_events_modals").css("display","none");
                          save_process("normal").then(function(response){
                            console.log("Guardado normal");
                            //$('#editor_frame').attr('src', $('#editor_frame').attr('src'));
                            let iframe = document.getElementById("editor_frame"); iframe.src = document.getElementById("editor_frame").contentWindow.location.pathname+"?reload=true";
                          });

                        }
                    }); 

              }
            }); 
      }

      $scope.modify_date = function(object,parameter)
      {
          console.log(document.querySelector("input[name='"+parameter+"_event_"+object.id+"']").value);
          object[parameter] = document.querySelector("input[name='"+parameter+"_event_"+object.id+"']").value;
      }

      $scope.delete_calendar_event = function(event)
      {

            editor_html.find('#CalendarContentModal_'+event.id).remove();

            let index = $scope.calendar_events.indexOf(event);

            console.log(index);
            $scope.calendar_events.splice(index, 1);
        

          /*swal({      
              title: decode_utf8('¿Esta seguro de eliminarlo?'),
              text: decode_utf8('El cambio se hará efectivo hasta que guarde nuevamente todos los eventos'),
              type: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, !adelante!'     
              }).then((result) => {
                if (result.value)
                {

                  //console.log($scope.calendar_events.splice(index, 1));

                 

                }
          });*/
      }

      $scope.add_event = function()
      {
          console.log($scope.new_event); 
          
          if($scope.new_event.title == null || $scope.new_event.start == null || $scope.new_event.end == null)
          {
            return alert("Faltan datos para crear el registro");  
          }


          var d1 = new Date($scope.new_event.start);
          var d2 = new Date($scope.new_event.end);

         if(d2 < d1 )
          {  
             return alert("Las fechas finales deben ser mayores a las iniciales, verifique e intente nuevamente para guardar"); 
              
          }

          let object_push;
          let last = $scope.calendar_events[$scope.calendar_events.length - 1];         
          object_push = angular.copy($scope.new_event);
          object_push.id = (parseInt(last.id)+parseInt(1)).toString(); 
          console.log(object_push);
          $scope.calendar_events.push(object_push);
          $scope.new_event = {};      
      }

      $scope.create_event_content = function(object)
      {
          let html_to_insert = create_modal_for_event(object);
          editor_html.find("body").append(html_to_insert); 
          $("#modalCalendarProperties").modal("hide");          
          editor_html.find('#CalendarContentModal_'+object.id).modal("show");
          $(".modal-backdrop.fade.in").hide();
          object.content = true;
      }


      $scope.modify_event_content = function(object)
      {
          $("#modalCalendarProperties").modal("hide");          
          editor_html.find('#CalendarContentModal_'+object.id).modal("show");
          $(".modal-backdrop.fade.in").hide();          
      }


}]);



//Hay que arreglar los path