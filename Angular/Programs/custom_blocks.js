var custom_blocks = angular.module("custom_blocks",["restful_module"]);

custom_blocks.factory('badrequestinterceptor',badrequestinterceptor);

provider_interceptors.$inject = ["$httpProvider"];  

custom_blocks.config('provider_interceptors',provider_interceptors);


