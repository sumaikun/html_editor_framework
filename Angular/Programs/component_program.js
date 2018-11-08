angular.module("components_module",[]).controller('ComponentController',['$scope','$timeout','$window','$compile','$filter','$interval','$http'
    ,function($scope,$timeout,$window,$compile,$filter,$interval){

        $scope.test = "test";

        $scope.show_divs = function(){

        }


        $scope.show_headers = function(){
            
        }

        $scope.show_footers = function(){
            
        }

        $scope.load_fragments = function(){
            
        }

        $scope.copy_html = function(){
           window.selected_html = $('#test_frame').contents().find("html").html();
           console.log(selected_html);
        }

}]);


