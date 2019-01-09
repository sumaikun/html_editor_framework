//$('input[type=button]').draggable({cancel:false});



var map_of_styles = [];

var elements_to_watch_on_screen = [];

function drag_on_x(html_element)
{
    if($(html_element).is('.ui-resizable'))
    {
        $(html_element).resizable("destroy");
        console.log("Resize destroy");   
    }

    $(html_element).draggable({
         axis: "x",
         cancel:false,        
         create: function (event, ui) {
                
            
         },        
         start: function (event, ui) {             
             //$(event.target).css("top","0px");
             console.log(event.target);
             console.log(ui.position);
             console.log("Start Movement");
         },
         stop: function (event, ui) {

             console.log("Finish Movement");

             set_properties_to_relative(["top","left"],event.target);             
             //$(event.target).css("top","0px");
             dynamic_rules_at_transformation(event.target);
      }
     });    
}


function drag_on_y(html_element)
{
    
    if($(html_element).is('.ui-resizable'))
    {
        $(html_element).resizable("destroy");
        console.log("Resize destroy");   
    }

    $(html_element).draggable({
         axis: "y",
         cancel:false,
         create: function (event, ui) {
                
            
         },
         start: function (event, ui) {
            console.log("Start Movement");  
         },
         stop: function (event, ui) {
            console.log("Finish Movement");
            set_properties_to_relative(["top","left"],event.target);
            dynamic_rules_at_transformation(event.target);
         }
     });   
}

function drag_in_both(html_element)
{
    
    if($(html_element).is('.ui-resizable'))
    {
        $(html_element).resizable("destroy");
        console.log("Resize destroy");   
    }

    $(html_element).draggable({
        cancel:false,
        create: function (event, ui) {
            
         },
         start: function (event, ui) {
            console.log("Start Movement");  
         },
         stop: function (event, ui) {
            console.log("Finish Movement");
            set_properties_to_relative(["top","left"],event.target);
            dynamic_rules_at_transformation(event.target);               
         }

    });
}


function resize_element(html_element)
{
    let original_element = html_element;

    if($(html_element).is(".ui-draggable"))
    {
        $(html_element).draggable("destroy");
        console.log("Drag destroy");
    }

    $(html_element).resizable({
            
        create: function (event, ui) {
            
            $(this).css("position","relative");
            
            console.log(this);

        },

        start: function (event, ui) {
             //start = ui.position.top;
         
             console.log("Start Resizing");
         },
         stop: function (event, ui) {
             console.log("Stop Resizing");

             console.log(event.target);
             console.log(this);

             set_properties_to_relative(["height","width"],original_element);
             dynamic_rules_at_transformation(original_element);

         }
    });

}


/*

    drag: function( event, ui ) {  
  $(this).css({
    "right": "auto",
    "bottom": "auto"
  });
},
stop: function (event, ui) {  
  $(this).css({
    "right": ($(window).width() - ($(this).offset().left + $(this).outerWidth())),
    "bottom": ($(window).height() - ($(this).offset().top + $(this).outerHeight())),
    "left": "auto",
    "top": "auto"
  });
}


*/

function set_properties_to_relative(properties,html_element)
{
    let relative_size;

    properties.forEach(function(property){
        console.log(editor_html.width());
        relative_size = (100/editor_html.width())*html_element.style[property].replace("px","");
        html_element.style[property] = relative_size+"vw";      
    });

}


function dynamic_id(element_to_identify)
{
    let id_to_generate;
    
    console.log(element_to_identify)

    if(element_to_identify.id == "")
    {
        let random_number = Math.ceil((Math.random() * 10000) + 1);
        id_to_generate = element_to_identify.localName+"_"+random_number;
        element_to_identify.id = id_to_generate;    
    }
    else
    {
        
        id_to_generate = element_to_identify.id;
    }

    return id_to_generate;  
}


function dynamic_rules_at_transformation(html_element)
{
    let media_query = editor_html.find("#media_query").get(0);

    let g_id = dynamic_id(html_element);


    switch(document.getElementById("editor_frame").className){
        case "tv_size":
            index_to_modify = 1;
            break;
        case "desktop_size":
            index_to_modify = 2;
            break;
        case "tablet_size":
            index_to_modify = 3;
            break;
        case "phone_size":
            index_to_modify = 5;
            break;
        case "small_phone_size":
            index_to_modify = 6;
            break;          
        default:
            
            break;
    }

    console.log(index_to_modify);


    let search = map_of_styles.find(function(map_style){  return map_style.selector == g_id   });

    if(search != null )
     {
        console.log("different");
        selector_index = map_of_styles.indexOf(search);
     }  
     else
     {                  
        selector_index = (map_of_styles.length);
        map_of_styles.push({selector:g_id,styles:[]});
        
     }

     //console.log(search);                
     
     let copy_obj;
     
     //console.log(selector_index);

     for(let k in html_element.style)
     {
        //console.log(typeof k);
        if(!isNaN(k))
        {

            /*console.log(k);
            console.log(html_element.style[k]);
            console.log(html_element.style[html_element.style[k]]);*/

            copy_obj = {};

            copy_obj[html_element.style[k]] = html_element.style[html_element.style[k]];

            map_of_styles[selector_index]["styles"].push(copy_obj);


        }
    }


    //console.log(map_of_styles);


    let MediaRules = media_query.sheet.cssRules;

    //console.log(MediaRules[0].cssRules);

    let found;

    map_of_styles.forEach(function(map_style){

        found = false;

        for(let j in MediaRules[index_to_modify].cssRules)
        { 


            if(MediaRules[index_to_modify].cssRules[j].selectorText  ==  "#"+map_style.selector )
            {               
                /*search = map_of_styles.find(function(map_style){  return map_style.selector == MediaRules[0].cssRules[j].selectorText.replace("#","")   });

                if(search)
                {
                    console.log("selector found:  "+search.selector);
                }*/

               // console.log("found");

                //console.log(MediaRules[index_to_modify].cssRules[j]);


                map_style.styles.forEach(function(style){
                    
                    for(let m in style)
                    {
                        //Conocer indices y agregarlos
                        //console.log(m);
                        //console.log(style[m]);

                        MediaRules[index_to_modify].cssRules[j].style[m] = style[m]; 

                    }

                });


                found = true;
                    
            }

            

        }

        if(!found)
        {
            cssTexttoAdd = " #"+map_style.selector+"{"+$(html_element).attr("style")+"} ";                      

            MediaRules[index_to_modify].insertRule(cssTexttoAdd,MediaRules[index_to_modify].cssRules.length);
        }


    });

    console.log(MediaRules);


    //console.log(elements_to_watch_on_screen.indexOf(html_element));

    if(elements_to_watch_on_screen.indexOf(html_element) == -1)
    {
        elements_to_watch_on_screen.push(html_element);
    
    }    
    
}


function reload_jquery_transformations()
{
    elements_to_watch_on_screen.forEach(function(element_to_watch){

        console.log(element_to_watch);
        if($(element_to_watch).is(".ui-draggable"))
        {
            $(element_to_watch).draggable("destroy");
            console.log("Drag destroy");
        }
        if($(element_to_watch).is(".ui-resizable"))
        {
            $(element_to_watch).resizable("destroy");
            console.log("Resize destroy");
        }

        $(element_to_watch).removeAttr("style");

    });

    editor_html.find(".ui-resizable").removeAttr("style");
    editor_html.find(".ui-draggable").removeAttr("style");
    //editor_html.find(".ui-resizable").resizable("destroy");
    //editor_html.find(".ui-draggable").draggable("destroy");

    elements_to_watch_on_screen = [];
    //console.log(elements_to_watch_on_screen);
}


function modify_media_query_V2()
{          
        
        let generated_css = "";
        
        let media_query = editor_html.find("#media_query").get(0);
        //console.dir(media_query);

        let MediaRules = media_query.sheet.cssRules;

       

        for (rule in MediaRules) {
            if(MediaRules[rule].cssText)
            {   
                generated_css +=  MediaRules[rule].cssText+"\n";
            }
        }

        getScope("#StyleCtrl").modify_styles({css:generated_css,route:remove_dns_server(media_query.href)}); 
    
}