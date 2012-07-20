// Bureau v0.1 - bureaujs.org/license - Will Shown | w@willshown.com

// Requires Zepto v1.0 or better, or the compatible version of jQuery

/* Planned features:
 • ease of setting up
 • masking inputs
 • per-input validation [1]
 • animation
 • model-binding compatibility
 • optional jquery-ui integration
 • thorough mobile compatibility
 */

/* Comments:
 • [1] Form validation may need to have options that allow compatibility with validation in SpineJS and BackboneJS
 */

(function($){

  $.fn.bureau = function(configuration){

    for(var selector in configuration) {

      var rules = configuration[selector];

      if(

        typeof rules.dependsOn == 'string' &&
        typeof rules.when == 'function'    &&
        typeof rules.then == 'function'    &&
        typeof rules.else == 'function'

        ){

        var $responding = $(selector);
        var $watched    = $(rules.dependsOn);

        $watched.on('change', function(e){
          if( rules.when.call($responding, $watched) ){
            rules.then.call($responding);
          }else{
            rules.else.call($responding);
          }
        });

        $watched.trigger('change');

      }
    }

  }

})(typeof Zepto !== "undefined" && Zepto !== null ? Zepto : jQuery);