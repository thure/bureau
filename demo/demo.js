// Bureau v0.2 - bureaujs.org/license - Will Shown | w@willshown.com

(function ($) {

  "use strict";

  window.console.log('Demo started.');

  $('fieldset#bureau-target').bureau({
    '.depends-on-option1': {
      'dependsOn': '#option1',
      'when': 'checked',
      'yup': 'show:height:400:ease-in-out',
      'nope': 'hide:height:400:ease-in-out'
    },
    '.depends-on-textinput2': {
      'dependsOn': '#textinput2',
      'when': /^[\d\s]+$/,
      'yup': 'show',
      'nope': 'hide'
    },
    '#textinput4': {
      'dependsOn': '#textinput4',
      'rules': [
        {
          'when': 'empty',
          'yup': function(){
            $(this).css('background-color','white');
          }
        },
        {
          'when': /^[0-9A-F]{3}$/i,
          'yup': function(){
            var self = this;
            $(this).css('background-color','#'+$(self).val());
          }
        },
        {
          'when': /^[0-9A-F]{6}$/i,
          'yup': function(){
            var self = this;
            $(this).css('background-color','#'+$(self).val());
          }
        }
      ]
    }
  });

}(typeof window.Zepto !== "undefined" && window.Zepto !== null ? window.Zepto : window.jQuery));