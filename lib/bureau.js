// Bureau v0.2 - bureaujs.org/license - Will Shown | w@willshown.com

// Requires Zepto v1.0 or better, or the compatible version of jQuery

(function ($) {

  "use strict";

  var exists     = function(obj) { return typeof obj !== "undefined" && obj !== null;};
  var usingZepto = exists(window.Zepto);
  var usingModernizr = exists(window.Modernizr);

  /* This block based upon Modernizr 2.6.2pre.
   * We default to whatever Modernizr the browser has already loaded.
   * If a browser supports transitions, then it almost certainly supports transformation. */
  var cssomPrefixes = 'Webkit Moz O ms'.split(' '), tElem = document.createElement('div');
  var testPropsAll = function (prop) {

     var mod = 'modernizr',
       modElem = document.createElement(mod),
       mStyle = modElem.style;

     function contains( str, substr ) {
       return !!~('' + str).indexOf(substr);
     }

     function testProps( props, prefixed ) {
       var i;
       for ( i in props ) {
         if (props.hasOwnProperty(i)){
           var prop = props[i];
           if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
             return prefixed === 'pfx' ? prop : true;
           }
         }
       }
       return false;
     }

     var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
       props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

     return testProps(props, undefined);
   };
  var prefix = (function() {
    if(exists($.fx.cssPrefix)){
      return $.fx.cssPrefix;
    }else{
      var vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' }, result = false;
      $.each(vendors, function(vendor, event){
        if (tElem.style[vendor + 'TransitionProperty'] !== undefined) {
          result = '-' + vendor.toLowerCase() + '-';
        }
      });
      return result;
    }
  }());
  var cssAnimations = usingModernizr && exists(window.Modernizr.cssanimations) ? window.Modernizr.cssanimations : testPropsAll('animationName');

  var isFunction = function(obj) { return                  Object.prototype.toString.call(obj) === '[object Function]'; };
  var isString   = function(obj) { return                  Object.prototype.toString.call(obj) === '[object String]';   };
  var isRegExp   = function(obj) { return                  Object.prototype.toString.call(obj) === '[object RegExp]';   };
  var isArray    = function(obj) { return Array.isArray || Object.prototype.toString.call(obj) === '[object Array]';    };

  $.fn.bureau = function (configuration) {

    var defaultTrigger = 'change',
      defaultOn = 'change keyup',
      possibleCallbacks = ['yup', 'nope', 'everyYup', 'everyNope'];

    var generateAnimation = function (showHide, property, durationMS, easing) {
      return function(){
        var durationS = durationMS / 1000;
        var props;
        if(property === 'height'){
          props = {
            'margin-top': $(this).css('margin-top'),
            'margin-bottom': $(this).css('margin-bottom'),
            'padding-top': $(this).css('padding-top'),
            'padding-bottom': $(this).css('padding-bottom'),
            'border-top-width': $(this).css('border-top-width'),
            'border-bottom-width': $(this).css('border-bottom-width'),
            'height': $(this).css('height')
          };
        }
        if(property === 'width'){
          props = {
            'margin-left': $(this).css('margin-top'),
            'margin-right': $(this).css('margin-bottom'),
            'padding-left': $(this).css('padding-top'),
            'padding-right': $(this).css('padding-bottom'),
            'border-left-width': $(this).css('border-left-width'),
            'border-right-width': $(this).css('border-right-width'),
            'width': $(this).css('width')
          };
        }
        if(cssAnimations){
          var transitionProps = '', p;
          $(this).css('overflow', 'hidden');
          for (p in props){
            if (props.hasOwnProperty(p)){
              if (showHide === 'show') { $(this).css(p, '0'); }
              transitionProps += p + " " + durationS + "s" + (exists(easing) ? ' ' + easing : '') + ', ';
            }
          }
          transitionProps = transitionProps.replace(/, $/g,'');
          $(this).attr('style', $(this).attr('style') + (' ' + prefix + 'transition' + ': ' + transitionProps + ';'));
          $(this).css(props);
          var $this = $(this);
          setTimeout(function(){
            var p, clear = {};
            for (p in props){
              if (props.hasOwnProperty(p)){
                clear[p] = '';
              }
            }
            clear[prefix + 'transition'] = '';
            $this.css(clear);
          },durationMS);
        }else{
          /*TODO: use jQuery animation */
          if(!usingZepto){
            /*TODO: animate manually */
          }
        }
      };
    };

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
              if(shortcut.length === 1){
                switch (shortcut[0]) {
                  case 'show':
                    callbacks[callback] = function () { $(this).show(); };
                    break;
                  case 'hide':
                    callbacks[callback] = function () { $(this).hide(); };
                    break;
                  default:
                    throw new Error('Bureau: Could not resolve string-shortcut "' + rules[callback] + '".');
                }
              }
              else if(shortcut.length > 2){
                callbacks[callback] = generateAnimation.apply(this, shortcut);
              }
              else {
                throw new Error('Bureau: String-shortcut for animation is missing mandatory options.');
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

}(typeof window.Zepto !== "undefined" && window.Zepto !== null ? window.Zepto : window.jQuery));