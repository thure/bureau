// Bureau v0.1 - bureaujs.org/license - Will Shown | w@willshown.com

;(function(){

  console.log('Demo started.');

  $('fieldset.bureau-target').bureau({
    '.depends-on-option1': {
      dependsOn: '#option1',
      when: function($watchedElem){
        return $watchedElem.prop('checked');
      },
      then: function(){
        $(this).show();
      },
      else: function(){
        $(this).hide();
      }
    }
  });

}());