// Bureau v0.2 - bureaujs.org/license - Will Shown | w@willshown.com

(function ($) {

  console.log('Demo started.');

  $('fieldset#bureau-target').bureau({
    '.depends-on-option1': {
      'dependsOn': '#option1',
      'updateOn': 'change keyup',
      'when': 'checked',
      'then': 'show',
      'else': 'hide'
    },
    '.depends-on-textinput2': {
      'dependsOn': '#textinput2',
      'updateOn': 'change keyup',
      'triggerAtStart': 'change',
      'when': /^[\d\s]+$/,
      'then': 'show',
      'else': 'hide'
    },
    '#textinput4': {
      'dependsOn': '#textinput4',
      'rules': [
        {
          'when': /^[0-9A-F]{3}$/i,
          'then': function(){
            var self = this;
            $(this).css('background-color','#'+$(self).val());
          }
        },
        {
          'when': /^[0-9A-F]{6}$/i,
          'then': function(){
            var self = this;
            $(this).css('background-color','#'+$(self).val());
          }
        }
      ]
    }
  });

})(typeof Zepto !== "undefined" && Zepto !== null ? Zepto : jQuery);