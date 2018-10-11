/* Use like
 * {{#if (or (and param1 param2) (and (not param3) param4) param5 param6 (and param7 param8)) }}
 * to get something like
 * "if ((param1 && param2) || (! param3 && param4) || param5 || param6 || (param7 && param8))"
 */
Handlebars.registerHelper ("or", function() {
    for (var i = 0; i < arguments.length - 1; ++i)
      if (arguments[i])
        return true;
    return false;
  });
Handlebars.registerHelper ("and", function() {
    for (var i = 0; i < arguments.length - 1; ++i)
      if (! arguments[i])
        return false;
    return true;
  });
Handlebars.registerHelper ("not", function(arg) {
	return arg ? false : true;
  });

Handlebars.registerHelper ("toLowerCase", function(arg) {
    if(arg != undefined && arg != '') {
        return arg.toLowerCase();
    }else{
        return null;
    }
});
Handlebars.registerHelper ("toUpperCase", function(arg) {
    if(arg != undefined && arg != '') {
        return arg.toUpperCase();
    }else{
        return null;
    }
});
Handlebars.registerHelper ("toCapitalize", function(arg) {
    if(arg != undefined && arg != '') {
        return arg.toLowerCase().replace( /\b./g, function(a){
            return a.toUpperCase();
        });
    }else{
        return null;
    }
});
/* Concatenates a copy of all parameters, each with the first character capitalized */
Handlebars.registerHelper ("capitalize", function (s) {
	var ret = "";
	for (var i = 0; i < arguments.length - 1; ++i)
	  ret += arguments [i] == null || arguments [i].length < 1
	         ? "" : arguments [i].charAt(0).toUpperCase() + arguments [i].slice(1);
	return ret;
});
Handlebars.registerHelper ("replace", function(string,arg1,arg2) {
    if(string != undefined && string != '') {
        return string.replace(arg1,arg2);
    }else{
        return null;
    }
});
Handlebars.registerHelper ("formatNumber", function(arg1,arg2) {
    if(arg1 != undefined && arg1 != '') {
        return Math.max(0, arg1).toFixed(0).replace(/(?=(?:\d{3})+$)(?!^)/g, '.');
    }else{
        if(arg2 != null && arg2 != undefined && arg2 != ''){
            return arg2;
        }
        else {
            return null;
        }
    }
});
Handlebars.registerHelper ("formatDateToDateTime", function(string) {
    if(string != undefined && string != '') {
        return string.substring(8, 10)+'/'+string.substring(5, 7)+'/'+string.substring(0, 4);
    }else{
        return null;
    }
});
Handlebars.registerHelper ("formatTimeToDateTime", function(string) {
    if(string != undefined && string != '') {
        return string.substring(11,13)+'h'+string.substring(14,16);
    }else{
        return null;
    }
});
Handlebars.registerHelper('ifEquals', function(arg1, arg2) {
    return (arg1 === arg2);
});
Handlebars.registerHelper('ifElse', function(arg1, condition, opt1, opt2) {
    if (arg1 === condition) {
        return opt1;
    } else {
        return opt2;
    }
});

Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    var operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

Handlebars.registerHelper('compareList', function(lvalue, rvalue, options) {

    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    var operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l.length == r; },
        '===':      function(l,r) { return l.length === r; },
        '!=':       function(l,r) { return l.length != r; },
        '<':        function(l,r) { return l.length < r; },
        '>':        function(l,r) { return l.length > r; },
        '<=':       function(l,r) { return l.length <= r; },
        '>=':       function(l,r) { return l.length >= r; },
        'typeof':   function(l,r) { return typeof l.length == r; }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});


/* Returns "singular" or "plural" versions of a message depending on a value */
Handlebars.registerHelper("singularOrPlural", function(val, ifSingular, ifPlural) {
    return val === 1 ? ifSingular : ifPlural;
});
/* Returns a slice of a list
*/
Handlebars.registerHelper('listSlice', function (list, start, size) {
	  return list.slice(start, size);
});


Handlebars.registerHelper('getYearFromDateTime', function(variable) {
    if(variable != undefined && variable != '') {
        return variable.substring(0, 4);
    }
    else return null;
});


