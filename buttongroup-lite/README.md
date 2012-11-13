ButtonGroup Plugin
==================

The ButtonGroup Plugin is a lightweight version of the ButtonGroup widget in
YUI. Since it's not a widget it does not rewrite the DOM and no internal nodes
are lost during rendering. Also, since it inherits from Y.Lite.Widget, it does
not have attributes.

All button nodes inside a ButtonGroup are plugged with Y.Lite.ToggleButton, but
their internal DOM event listening is replaced with event delegation from the
button group content box for performance.

ButtoGroup Lite fires simple events with a fake facade. This facade has a
`selection` property which type changes based on the type of the group. In the
case of `radio` groups, `selection` is an object with `button` and `index`
properties. If `allowNone` is set, it can be a null object. In the case of
`checkbox` groups, `selection` is an array of objects similar to the previous
case.

If no type is selected, the button group will not change the selected status
of interior buttons.

TODO: support selecting buttons from JavaScript