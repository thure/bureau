// Bureau v0.2 - bureaujs.org/license - Will Shown | w@willshown.com

// Requires Zepto v1.0 or better, or the compatible version of jQuery

(function ($) {

  "use strict";

  var exists     = function(obj) { return typeof obj !== "undefined" && obj !== null;};
  var usingZepto = exists(window.Zepto);
  var usingModernizr = exists(window.Modernizr);
  var keyframeUID = 0;

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
  var eventPrefix, nativePrefix, prefix = (function() {
    var vendors = { Webkit: 'webkit', Moz: '', O: 'o', ms: 'MS' }, result = false;
    $.each(vendors, function(vendor, event){
      if (tElem.style[vendor + 'TransitionProperty'] !== undefined) {
        result = '-' + vendor.toLowerCase() + '-';
        nativePrefix = vendor;
        eventPrefix = event;
      }
    });
    return result;
  }());
  var cssAnimations = usingModernizr && exists(window.Modernizr.cssanimations) ? window.Modernizr.cssanimations : testPropsAll('animationName');

  var isFunction = function(obj) { return                  Object.prototype.toString.call(obj) === '[object Function]'; };
  var isString   = function(obj) { return                  Object.prototype.toString.call(obj) === '[object String]';   };
  var isRegExp   = function(obj) { return                  Object.prototype.toString.call(obj) === '[object RegExp]';   };
  var isArray    = function(obj) { return Array.isArray || Object.prototype.toString.call(obj) === '[object Array]';    };

  $.fn.bureauTotal = function(dimension){
    
    var m, metrics, result = 0, $this = $(this);
    if(dimension === 'height'){
      metrics = {
        'height': $this.css('height'),
        'margin-top': $this.css('margin-top'),
        'margin-bottom': $this.css('margin-bottom'),
        'padding-top': $this.css('padding-top'),
        'padding-bottom': $this.css('padding-bottom'),
        'border-top-width': $this.css('border-top-width'),
        'border-bottom-width': $this.css('border-bottom-width')
      };
    }
    else if(dimension === 'width'){
      metrics = {
        'width': $this.css('height'),
        'margin-left': $this.css('margin-left'),
        'margin-right': $this.css('margin-right'),
        'padding-left': $this.css('padding-left'),
        'padding-right': $this.css('padding-right'),
        'border-left-width': $this.css('border-left-width'),
        'border-right-width': $this.css('border-right-width')
      };
    }
    else{
      return result;
    }

    for(m in metrics){
      if(metrics.hasOwnProperty(m)){
        result += parseInt(metrics[m], 10);
      }
    }

    return result;
    
  };
  
  $.fn.bureau = function (configuration) {

    var defaultTrigger = 'change',
      defaultOn = 'change keyup',
      possibleCallbacks = ['yup', 'nope', 'everyYup', 'everyNope'];

    var generateAnimation = function (showHide, property, durationMS, easing) {

      return function(){

        var init = durationMS === 0;
        var initMod = init ? '-init' : '';

        var durationS = durationMS / 1000;
        var $this = $(this);
        var total = $this.bureauTotal(property) + 'px';

        var $wrapper;
        if($this.parent().hasClass('bureauWrapper')){
          $wrapper = $this.parent();
        }else{
          $wrapper = $('<div class="bureauWrapper" style="margin: 0; padding: 0; border: 0; font-size: 100%; font: inherit; vertical-align: baseline; overflow: hidden;"></div>');
          $this.wrapAll($wrapper);
          $wrapper = $this.parent();
        }

        var to = (showHide === 'hide' ? '0px' : total),
          from = (showHide === 'show' ? '0px' : total);

        if(cssAnimations){

          var uid;

          if(typeof $this.data('anim-'+showHide+initMod) === 'undefined'){

            uid = keyframeUID; keyframeUID += 1;
            var keyframes = '@' + prefix + 'keyframes bureauToggle'+uid+' { '+
              'from { max-'+ property + ': ' + from +'}'+
                'to { max-'+ property + ': ' + to +'}'+
              '}';
            if( document.styleSheets && document.styleSheets.length ) {
              document.styleSheets[0].insertRule( keyframes, 0 );
            } else {
              var s = document.createElement( 'style' );
              s.innerHTML = keyframes;
              document.getElementsByTagName( 'head' )[ 0 ].appendChild( s );
            }
            $(this).data('anim-'+showHide+initMod, uid);

          }else{
            uid = parseInt($this.data('anim-'+showHide+initMod),10);
          }

          $wrapper.on('animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd', function(){
          }).get(0).style[ nativePrefix + 'Animation' ] = 'bureauToggle' + uid + ' ' + durationS + 's ' + easing + ' both';

        }else{
          if(!usingZepto /* using jQuery */){
            var animateWrapper = function (){
              $wrapper.css('max-'+property, from);
              var prop = {}; prop['max-'+property] = to;
              $wrapper.animate(prop,durationMS, easing, function(){
              });
            };
            animateWrapper();
          }else{
            if(showHide === 'show') { $(this).show(); }
            if(showHide === 'hide') { $(this).hide(); }
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
                // it's an animation...
                callbacks[callback] = generateAnimation.apply(this, shortcut);
                callbacks['init-'+callback] = generateAnimation.call(this, shortcut[0], shortcut[1], 0.1, shortcut[3]);
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

      return function (e, state) {
        var validation = validator.call($watched, $responding);
        if ($watched.data('previous-validation') !== validation.toString()){
          $watched.data('previous-validation',validation.toString()).trigger('bureau:change', [validation]);
          if(validation){
            if(state === 'init' && exists(callbacks['init-yup'])) {callbacks['init-yup'].call($responding, $watched);}else{
              if(exists(callbacks.yup)) {callbacks.yup.call($responding, $watched);}
            }
          }else{
            if(state === 'init' && exists(callbacks['init-nope'])) {callbacks['init-nope'].call($responding, $watched);}else{
              if(exists(callbacks.nope)) {callbacks.nope.call($responding, $watched);}
            }
          }
        }
        if (validation) {
          if(state === 'init' && exists(callbacks['init-everyYup'])) {callbacks['init-everyYup'].call($responding, $watched);}else{
            if(exists(callbacks.everyYup))  {callbacks.everyYup.call($responding, $watched);}
          }
        } else {
          if(state === 'init' && exists(callbacks['init-everyNope'])) {callbacks['init-everyNope'].call($responding, $watched);}else{
            if(exists(callbacks.everyNope)) {callbacks.everyNope.call($responding, $watched);}
          }
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
            $watched.trigger(isString(subject.triggerAtStart) ? subject.triggerAtStart : defaultTrigger , ['init']);

          }

        }
      }

    });

  };

}(typeof window.Zepto !== "undefined" && window.Zepto !== null ? window.Zepto : window.jQuery));