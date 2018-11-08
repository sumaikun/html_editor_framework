$(document).ready(function(){
    $(".locationLink p").on("click",function(){
        $("#locationtext").html(($(this).html()));
    });
});