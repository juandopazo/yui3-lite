Widget Lite
===========

The Widget Lite module provides a base class for Widget-like Node plugins
available at Y.Lite.Widget.

Y.Lite.Widget normalizes class names adding classnames in the same way that
Y.Widget does and through a `getClassName` method.

It provides a similar lifecycle to Y.Widget with `initializer`, `destructor`,
`renderUI`, `bindUI` and `syncUI` methods. It also automatically creates
`boundingBox` and `contentBox` properties on the instance based on the plugin
host. Keep in mind that it doesn't inherit from Y.Plugin.Base, so it doesn't have
attributes. The state of your widget extending this class should be based
on class names and `data-` attributes.

When developing plugins based on Y.Lite.Widget keep the API minimal, not
based on state. This plugins should be lightweight and interaction with other
components should also be minimal. More complex interactions should be supported
by widgets based on Y.Widget.

This is an example of a Button plugin based on Y.Lite.Widget:
```
function Button() {
	Button.superclass.constructor.apply(this, arguments);
}
Y.extend(Button, Y.Lite.Widget, {
	initializer: function (config) {
		if (config.label) {
			this.boundingBox.set('text', config.label);
		}
	},
	syncUI: function () {
		if (this.boundingBox.get('disabled')) {
			this.disable();
		}
	},
	enable: function () {
		var button = this.boundingBox;

		button.set('disabled', true);
		button.addClass(this.getClassName('disabled'));
	},
	disable: function () {
		var button = this.boundingBox;

		button.set('disabled', true);
		button.addClass(this.getClassName('disabled'));
	}
});
Y.namespace('Plugin').Button = Button;
```