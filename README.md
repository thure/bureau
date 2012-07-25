bureau.js
========

Bureau is a little library that helps you make forms that respond to user input. It's meant to help you perform typical tasks associated with designing complex HTML forms, such as showing/hiding additional form elements depending on the values of other form elements.

Currently this is a stub of its future form, with many more features currently in development. The merge from my local repository with this one on Github has not yet occurred.

Additional planned features are:
+ masking inputs
+ input validation (built-in, and compatibility with M*C frameworks)
+ easy use of Zepto/jQuery's animation
+ model-binding compatibility
+ optional jquery-ui integration (i.e. support for sliders, droppables, etc.)
+ thorough mobile compatibility
+ support for <select multiple="multiple"> elements

**Bear in mind: bureau.js's API may change!**
*When you download a new version, be sure to check its usage.*

Usage
-----

    $('fieldset.bureau-target').bureau({
        '.show-if-checkbox1-is-checked': {
            dependsOn: '#checkbox1',
            when: 'checked',
            then: 'show',
            else: 'hide'
        }
    });

The above example illustrates a common use for bureau.js.

All you've got to do is call `bureau` on the scope you'd like to restrict the form business to, then pass it an object which has as keys Zepto/jQuery selectors to elements which will respond to form input. The values of those keys are also objects, each with a specific set of keys:

+ `dependsOn`: a selector for form elements whose values/attributes will be listened to
+ `when`: a function, or a regular expression that will be tested using the values of the elements selected by `dependsOn`, or a string corresponding to a common validator such as `"checked"`
+ `then`: a function or a string representing a common function (like `"show"` or `"hide"`) that is executed when `when` evaluates to `true`
+ `else`: a function or a string representing a common function that is executed when `when` evaluates to `false`

(Hint: don't make `when` a very computationally intense function for now.)

The context given to `when`, `then`, and `else`, i.e. the evaluation of `this` in those callbacks, is always the Zepto/jQuery instance of the responding element(s), not the instance of the `dependsOn` element(s).
The `when` function can take one argument: the `dependsOn` Zepto/jQuery instance. The `then` and `else` functions currently take no arguments.

The equivalent call to bureau of the example above, which defines functions equivalent to the string shortcuts used in the example, looks like this:

    $('fieldset.bureau-target').bureau({
      '.show-if-checkbox1-is-checked': {
        dependsOn: '#checkbox1',
        'when': function ($checkbox) {
          return $checkbox.prop('checked');
        },
        'then': function () {
          $(this).show();
        },
        'else': function () {
          $(this).hide();
        }
      }
    });
