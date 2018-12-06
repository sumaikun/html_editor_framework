function getScope(node)
{
	 var scope = angular.element(document.querySelector(node)).scope();
	 return scope;
}

function encode_utf8(s)
{
	return unescape(encodeURIComponent(s));
}

function decode_utf8(s)
{
	return decodeURIComponent(escape(s));
}

function context_menu_object(selector,callback,getitems){
	//console.log(getitems);
    var self = this;
    this.selector = selector,	     
    this.build = function($trigger, e) {						
	return {			        
        callback: callback,
    	items: getitems()
	};
  }
}

function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}


function clone(obj) {
    if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
    else
        var temp = obj.constructor();

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = clone(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    return temp;
}


(function ($, sr) {
// debouncing function from John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
var debounce = function (func, threshold, execAsap) {
        var timeout;
        //console.log(timeout);
        return function debounced() {
            //console.log(timeout);
            var obj = this, args = arguments;
            function delayed() {
                //console.log("execute");
                //if (!execAsap)
                    
                func.apply(obj, args);
                
                timeout = null;
            };
            if (timeout) { clearTimeout(timeout);
            } //else if (execAsap) { console.log(execAsap);  func.apply(obj, args);}
            //timeout = setTimeout(delayed, threshold || 100);
            timeout = setTimeout(delayed,  100);
            //console.log(timeout);
        };
    }
    jQuery.fn[sr] = function (fn) { return fn ? this.on('DOMNodeInserted', debounce(fn)) : this.trigger(sr); };
})(jQuery, 'debouncedDNI');


function makeDoubleRightClickHandler( handler ) {
    var timeout = 0, clicked = false;
    return function(e) {

        //e.preventDefault();

        if( clicked ) {
            clearTimeout(timeout);
            clicked = false;
            return handler.apply( this, arguments );
        }
        else {
            clicked = true;
            timeout = setTimeout( function() {
                clicked = false;
            }, 300 );
        }
    };
}

/*$(document).contextmenu( makeDoubleRightClickHandler( function(e) {
    console.log("double right click" );
}));*/


//Una clase para iterar parametros e identificar si existe

function check_if_exist_in_objects(object_search,array_objects)
{
    for(var k in array_objects)
    {
        //let fake_object = {};
        for(var j in object_search)
        {            
            if(array_objects[k][j] ==  object_search[j])
            {
                return true;
            }
        }
    }

    return false;
}


//Otra para eliminar el dns de las url

function remove_dns_server(url)
{
    str = url.replace( window.location.origin,"");
    return str ;
}


function get_folder_proyect(url)
{
    path = url;

    path.indexOf(1);

    //path.toLowerCase();

    path = path.split("/")[1];

    console.log(path);

    return path;
}


/*var keys = {};

function active_keys_listeners(){
    
    window.onkeyup = function(e) { 
    //console.log(e.keyCode);
    keys[e.keyCode] = false; 
    }
    window.onkeydown = function(e) {
        console.log(e.keyCode);
        keys[e.keyCode] = true; 
        console.log(keys);
    }    
}

active_keys_listeners();*/

function arraymove(arr, fromIndex, toIndex) {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

function URL_add_parameter(url, param, value){
    var hash       = {};
    var parser     = document.createElement('a');

    parser.href    = url;

    var parameters = parser.search.split(/\?|&/);

    for(var i=0; i < parameters.length; i++) {
        if(!parameters[i])
            continue;

        var ary      = parameters[i].split('=');
        hash[ary[0]] = ary[1];
    }

    hash[param] = value;

    var list = [];  
    Object.keys(hash).forEach(function (key) {
        list.push(key + '=' + hash[key]);
    });

    parser.search = '?' + list.join('&');
    return parser.href;
}

