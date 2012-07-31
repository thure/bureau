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
          'when': /^[0-9a-fA-F]{3}$/,
          'then': function(){
            $(this).css('background-color',$(this).val());
          }
        },
        {
          'when': /^[0-9a-fA-F]{6}$/,
          'then': function(){
            $(this).css('background-color',$(this).val());
          }
        }
      ]
    }
  });

})(typeof Zepto !== "undefined" && Zepto !== null ? Zepto : jQuery);