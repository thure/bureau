![](https://pbs.twimg.com/media/AysyE7kCMAAdS9Y.jpg)

Intro
-----

bureau.js is a little library that helps you make forms that respond to user input. It's meant to help you perform typical tasks associated with designing complex HTML forms, such as showing/hiding additional form elements depending on the values of other form elements.

Additional planned features comprise [three milestones in the issues section][milestones].

**Bear in mind: bureau.js's API is not stable!** When you download a new version, be sure to check its usage.

Usage
-----

```javascript
$('fieldset.bureau-target').bureau({
    '.show-if-checkbox1-is-checked': {
        'dependsOn': '#checkbox1',
        'when': 'checked',
        'yup': 'show',
        'nope': 'hide'
    }
});
```

The above example illustrates a common use for bureau.js.

### Structure ###

Each call to `bureau` requires an Object with Zepto/jQuery selectors as keys and a ‘rule set’ as each key's value. A rule set is comprised of `dependsOn: /*selector*/` *and either* `rules: /*array of rules*/` *or* a single set of rules (as in the above example).

In this documentation, the resultant elements of the Zepto/jQuery selector that is the key of a rule set will be called the “responding elements” and the same for the `dependsOn` property of the rule set will be called the “attended elements”.

#### Pseudo-Scheme ####

```javascript
$(scope).bureau({
    responding_elements: {
        'dependsOn': attended_elements,
        'rules': [
            {
                'when': function( if (something) { return true } else { return false } ),
                'yup': function( /*do this if 'when' changes to true*/ ),
                'nope': function( /*do this if 'when' changes to false*/ ),
                'updateOn': 'some_event some_other_event'
            },
            { … }, …
        ],
        'triggerAtStart': 'some_event some_special_event'
        'mask': 'masking_string'
    }
});
```

#### Rules ####

Rules have two required components: `when` and at least one callback, `yup`, `nope`, `everyYup`, or `everyNope`. All of these can be defined as Functions or Strings (called “string shortcuts” here, see below for which are available), and `when` can also be defined as a Regular Expression (called using `.test($(this).val());`).

When `when` is called and evaluates to `true`, the `everyYup` callback is executed, otherwise the `everyNope` callback is executed. Additionally, if `when`'s evaluation changed since the last time, `yup` is executed if it changed to `true`, and `nope` is executed if it changed to `false`.

`this` evaluates to the attended elements for `when`, but not for `yup` or `nope` (etc) where `this` evaluates to the responding elements.

You can specify the events on which `when` is evaluated by adding the `updateOn` property (default is `'change keyup'`) to the rules. You can also specify which events are fired on the attended elements elements right after the callbacks are ready by adding the `triggerAtStart` property (default is `'change'`). Use a space-separated list of events for both of those, and keep in mind `updateOn` belongs to each group of rules, while `triggerAtStart` belongs to the rule set at large.

You can also mask any inputs by adding a `mask` property with a value that corresponds to the mask you want to apply. [See the Masked Input Plugin page][maskedinput] for more details.

### String shortcuts ###

##### `when` #####

`'checked'`: `$(this).prop('checked')`

`'empty'`: `$(this).val() === ''`

##### `yup`/`nope`/`everyYup`/`everyNope` #####

`'show'`: `$(this).show();`

`'hide'`: `$(this).hide();`

`'showOrHide:heightOrWidth:durationInMs:easing'`: this gives an animation function that works with the tools the browser has available; if CSS animations aren't available, but jQuery is, it uses jQuery's JavaScript-based animation. As the ultimate fallback, it just `.show()`s or `.hide()`s the responding elements. `easing` is optional.

License
-------
bureau.js is released under the **MIT License**. You can always find it at [http://bureaujs.org/license][1].

[1]: http://bureaujs.org/license
[milestones]: https://github.com/thure/bureau/issues/milestones
[maskedinput]: http://digitalbush.com/projects/masked-input-plugin/
