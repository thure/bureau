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
 • support for <select multiple />
 */

/* Comments:
 • [1] Form validation may need to have options that allow compatibility with validation in SpineJS and BackboneJS
 */

(function ($) {

  "use strict";

  $.fn.bureau = function (configuration) {

    var isFunction = function(obj) { return Object.prototype.toString.call(obj) === '[object Function]'; };
    var isString   = function(obj) { return Object.prototype.toString.call(obj) === '[object String]';   };
    var isRegExp   = function(obj) { return Object.prototype.toString.call(obj) === '[object RegExp]';   };

    var generateBinding = function (rules, $responding, $watched) {

      var callback, validator, callbacks = {};

      for ( callback in rules ) {
        if (rules.hasOwnProperty(callback)) {
          if (callback === 'when') {
            // is it a function?
            if (isFunction(rules.when)) {
              validator = rules.when;
            // is it a string?
            } else if (isString(rules.when)) {
              switch (rules.when) {
                case 'checked':
                  validator = function () { return $(this).prop('checked'); };
                  break;
                default:
                  window.console.error('Bureau: Could not resolve string-shortcut "' + rules.when + '".');
                  break;
              }
            // is it a regex?
            } else if (isRegExp(rules.when)) {
              validator = function () { return rules.when.test($(this).val()); };
            }
          } else if (callback === 'then' || callback === 'else') {
            //is it a function?
            if (isFunction(rules[callback])) {
              callbacks[callback] = rules[callback];
            //is it a string?
            } else if (isString(rules[callback])) {
              switch (rules[callback]) {
                case 'show':
                  callbacks[callback] = function () { $(this).show(); };
                  break;
                case 'hide':
                  callbacks[callback] = function () { $(this).hide(); };
                  break;
                default:
                  window.console.error('Bureau: Could not resolve string-shortcut "' + rules[callback] + '".');
                  break;
              }
            }
          }
        }
      }

      return function (e) {
        if (validator.call($watched, $responding)) {
          callbacks['then'].call($responding, $watched);
        } else {
          callbacks['else'].call($responding, $watched);
        }
      };

    };

    return this.each(function(){

      var $this = $(this);

      var selector;
      for (selector in configuration) {
        if (configuration.hasOwnProperty(selector)) {

          var rules = configuration[selector];

          if (// validating arguments:
            isString(rules.dependsOn) &&
              (isFunction(rules.when)    || isString(rules.when)    || isRegExp(rules.when)) &&
              (isFunction(rules.then)    || isString(rules.then)                           ) &&
              (isFunction(rules['else']) || isString(rules['else'])                        )
            ) {

            var $responding = $(selector,        $this);
            var $watched    = $(rules.dependsOn, $this);

            $watched.on('change keyup', generateBinding(rules, $responding, $watched));
            $watched.trigger('change');

          }

        }
      }

    });

  };

})(typeof window.Zepto !== "undefined" && window.Zepto !== null ? window.Zepto : window.jQuery);