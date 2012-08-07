// Bureau v0.2 - bureaujs.org/license - Will Shown | w@willshown.com

// Requires Zepto v1.0 or better, or the compatible version of jQuery

(function ($) {

  "use strict";

  $.fn.bureau = function (configuration) {

    var defaultTrigger = 'change';
    var defaultOn = 'change keyup';
    var possibleCallbacks = ['everyYup', 'everyNope', 'yup', 'nope'];
    var exists     = function(obj) { return typeof obj !== "undefined" && obj !== null;};

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
            case 'empty':
              validator = function () { return $(this).val() === ''; };
              break;
            default:
              throw new Error('Bureau: Could not resolve string-condition "'+ rules.when +'".');
          }
        } else if (isRegExp(rules.when)) {
          validator = function () { return rules.when.test($(this).val()); };
        } else {
          throw new TypeError('Bureau: "when" condition is the wrong type.');
        }

        // make other callbacks
        var i;
        for (i=0; i<possibleCallbacks.length; i+=1) {
          var callback = possibleCallbacks[i];
          if(exists(rules[callback])){
            if (isFunction(rules[callback])) {
              callbacks[callback] = rules[callback];
            } else if (isString(rules[callback])) {
              var shortcut = rules[callback].split(':');
              switch (shortcut[0]) {
                case 'show':
                  if(shortcut.length === 1){
                    callbacks[callback] = function () { $(this).show(); };
                  }else{
                    throw new Error('Bureau: Could not resolve string-shortcut "' + rules[callback] + '".');
                  }
                  break;
                case 'hide':
                  if(shortcut.length === 1){
                    callbacks[callback] = function () { $(this).hide(); };
                  }else{
                    throw new Error('Bureau: Could not resolve string-shortcut "' + rules[callback] + '".');
                  }
                  break;
                default:
                  throw new Error('Bureau: Could not resolve string-shortcut "' + rules[callback] + '".');
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
        var validation = validator.call($watched, $responding);
        if ($watched.data('previous-validation') !== validation.toString()){
          $watched.data('previous-validation',validation.toString()).trigger('bureau:change', [validation]);
          if(validation){
            if(exists(callbacks.yup)) {callbacks.yup.call($responding, $watched);}
          }else{
            if(exists(callbacks.nope)) {callbacks.nope.call($responding, $watched);}
          }
        }
        if (validation) {
          if(exists(callbacks.everyYup))  {callbacks.everyYup.call($responding, $watched);}
        } else {
          if(exists(callbacks.everyNope)) {callbacks.everyNope.call($responding, $watched);}
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
                for(i=0; i<subject.rules.length; i+=1){
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