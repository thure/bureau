// Bureau v0.2 - bureaujs.org/license - Will Shown | w@willshown.com

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

    var defaultTrigger = 'change';
    var defaultOn = 'change keydown';
    var possibleCallbacks = ['then', 'else'];
    var exists     = function(obj) { return typeof obj !== "undefined" && obj !== null};

    var isFunction = function(obj) { return                  Object.prototype.toString.call(obj) === '[object Function]'; };
    var isString   = function(obj) { return                  Object.prototype.toString.call(obj) === '[object String]';   };
    var isRegExp   = function(obj) { return                  Object.prototype.toString.call(obj) === '[object RegExp]';   };
    var isArray    = function(obj) { return Array.isArray || Object.prototype.toString.call(obj) === '[object Array]';    };

    var generateBinding = function (rules, $responding, $watched) {

      var validator, callbacks = {};

      if (exists(rules.when)) {

        // make 'when' validator
        if (isFunction(rules.when)) {
          validator = rules.when;
        } else if (isString(rules.when)) {
          switch (rules.when) {
            case 'checked':
              validator = function () { return $(this).prop('checked'); };
              break;
            default:
              throw new Error('Bureau: Could not resolve string-condition "'+ rules.when +'".');
              break;
          }
        } else if (isRegExp(rules.when)) {
          validator = function () { return rules.when.test($(this).val()); };
        } else {
          throw new TypeError('Bureau: "when" condition is the wrong type.');
        }

        // make other callbacks
        var i;
        for (i in possibleCallbacks) {
          var callback = possibleCallbacks[i];
          if(exists(rules[callback])){
            if (isFunction(rules[callback])) {
              callbacks[callback] = rules[callback];
            } else if (isString(rules[callback])) {
              switch (rules[callback]) {
                case 'show':
                  callbacks[callback] = function () { $(this).show(); };
                  break;
                case 'hide':
                  callbacks[callback] = function () { $(this).hide(); };
                  break;
                default:
                  throw new Error('Bureau: Could not resolve string-shortcut "' + rules[callback] + '".');
                  break;
              }
            } else {
              throw new TypeError('Bureau: "'+ callback +'" callback is the wrong type.');
            }
          }
        }

      } else {
        throw new Error('Bureau: no "when" condition to act upon.');
      }

      return function (e) {
        if (validator.call($watched, $responding)) {
          exists(callbacks['then']) ? callbacks['then'].call($responding, $watched) : false;
        } else {
          exists(callbacks['else']) ? callbacks['else'].call($responding, $watched) : false;
        }
      };

    };

    return this.each(function(){

      var $this = $(this);

      var selector;
      for (selector in configuration) {
        if (configuration.hasOwnProperty(selector)) {

          var subject = configuration[selector];

          if (isString(subject.dependsOn))
          {

            var $responding = $(selector,          $this);
            var $watched    = $(subject.dependsOn, $this);

            try{
              if (subject.hasOwnProperty('rules') && isArray(subject.rules)){
                var i;
                for(i in subject.rules){
                  var rule = subject.rules[i];
                  $watched.on (isString(rule.updateOn) ? rule.updateOn : defaultOn, generateBinding(rule, $responding, $watched));
                }
              }else{
                $watched.on (isString(subject.updateOn) ? subject.updateOn : defaultOn, generateBinding(subject, $responding, $watched));
              }
            } catch (error){
              window.console.error(error.message);
            }
            $watched.trigger(isString(subject.triggerAtStart) ? subject.triggerAtStart : defaultTrigger );

          }

        }
      }

    });

  };

})(typeof window.Zepto !== "undefined" && window.Zepto !== null ? window.Zepto : window.jQuery);