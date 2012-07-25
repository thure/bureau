// Bureau v0.1 - bureaujs.org/license - Will Shown | w@willshown.com

(function ($) {

  console.log('Demo started.');

  //here's the full callback definition case:
//  $('fieldset.bureau-target').bureau({
//    '.depends-on-option1': {
//      dependsOn: '#option1',
//      'when': function ($watchedElem) {
//        return $watchedElem.prop('checked');
//      },
//      'then': function () {
//        $(this).show();
//      },
//      'else': function () {
//        $(this).hide();
//      }
//    }
//  });

  //here's what it should look like for simple showing:
  $('fieldset.bureau-target').bureau({
    '.depends-on-option1': {
      'dependsOn': '#option1',
      'when': 'checked',
      'then': 'show',
      'else': 'hide'
    },
    '.depends-on-textinput2': {
      'dependsOn': '#textinput2',
      'when': /^[\d\s]+$/,
      'then': 'show',
      'else': 'hide'
    }
  });

})(typeof Zepto !== "undefined" && Zepto !== null ? Zepto : jQuery);