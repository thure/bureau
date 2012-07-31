![](http://willshown.com/bureaurepo/bureau.long.png)

Intro
-----

bureau.js is a little library that helps you make forms that respond to user input. It's meant to help you perform typical tasks associated with designing complex HTML forms, such as showing/hiding additional form elements depending on the values of other form elements.

Additional planned features are:
+ masking inputs
+ automatic focus adjustment options
+ input validation (built-in, and compatibility with popular JavaScript MV* frameworks)
+ easy use of Zepto/jQuery's animation
+ model-binding compatibility
+ optional jQuery UI integration (i.e. support for sliders, droppables, etc.)
+ thorough mobile compatibility
+ support for `<select multiple="multiple">` elements

**Bear in mind: bureau.js's API is not stable!** When you download a new version, be sure to check its usage.

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

### Structure ###

Each call to `bureau` requires an Object with Zepto/jQuery selectors as keys and a ‘rule set’ as each key's value. A rule set is comprised of `dependsOn: /*selector*/` *and either* `rules: /*array of rules*/` *or* a single set of rules (as in the above example).

In this documentation, the resultant elements of the Zepto/jQuery selector that is the key of a rule set will be called the “responding elements” and the same for the `dependsOn` property of the rule set will be called the “attended elements”.

#### Pseudo-Scheme ####

    $(scope).bureau({
        responding_elements: {
            dependsOn: attended_elements,
            rules: [
                {
                    when: function( if (something) { return true } else { return false } ),
                    then: function( /*do something if this 'when' is true*/ ),
                    else: function( /*do something if this 'when' is false*/ ),
                    updateOn: 'some_event some_other_event'
                },
                { … }, …
            ],
            triggerAtStart: 'some_event some_special_event'
        }
    });

#### Rules ####

Rules have two required components: `when` and at least one callback, `then` or `else`. All of these can be defined as Functions or Strings (called “string shortcuts” here, see below for which are available), and `when` can also be defined as a Regular Expression (called using `.test($(this).val());`).

When `when` is called and evaluates to `true`, the `then` callback is executed, otherwise the `else` callback is executed.

`this` evaluates to the attended elements for `when`, but not for `then` or `else` where `this` evaluates to the responding elements.

You can specify the events on which `when` is evaluated by adding the `updateOn` property (default is `'change keyup'`) to the rules. You can also specify which events are fired on the attended elements elements right after the callbacks are ready by adding the `triggerAtStart` property (default is `'change'`). Use a space-separated list of events for both of those, and keep in mind `updateOn` belongs to each group of rules, while `triggerAtStart` belongs to the rule set at large.

### String shortcuts ###

##### `when` #####

`'checked'`: `$(this).prop('checked')`

`'empty'`: `$(this).val() === ''`

##### `then`/`else` #####

`'show'`: `$(this).show();`

`'hide'`: `$(this).hide();`

License
-------
bureau.js is released under the **MIT License**. You can always find it at [http://bureaujs.org/license][1].

[1]: http://bureaujs.org/license