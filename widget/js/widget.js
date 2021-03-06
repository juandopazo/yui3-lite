var getClassName = Y.ClassNameManager.getClassName,
    slice = Array.prototype.slice,
    INITIALIZER = 'initializer',
    DESTRUCTOR = 'destructor';

/**
A lighweight base class for developing simple plugins that behave like widgets.

@class Lite.Widget
@param {Object} config Object literal specifying configuration properties.
  @param {String} [config.cssPrefix] Optional prefix for all CSS classes used by
    this widget
**/
function WidgetLite(config) {
    WidgetLite.superclass.constructor.apply(this, arguments);

    config = config || {};

    var host = config.host;

    /**
    @property boundingBox
    @type Node
    **/
    this.boundingBox = host;

    /**
    @property contentBox
    @type Node
    **/
    this.contentBox = host.one(this.CONTENT_SELECTOR) || host;

    /**
    @property _cssPrefix
    @type String
    @private
    **/
    this._cssPrefix = config.cssPrefix || this.constructor.CSS_PREFIX || 
                      getClassName(this.constructor.NS.toLowerCase());

    /**
    A list of event handles attached during the lifetime of the
    plugin. All this handles get detached when the plugin is detached.
    You're encouraged to add handles to this list when extending the
    Y.Lite.Widget class.

    @property _handles
    @type Array
    @protected
    **/
    this._handles = [];

    this.init(config);
}

/**
@property NS
@type String
@value widget
@static
**/
WidgetLite.NS = 'widget';

/**
@property CLASS_NAMES
@type Object
@static
**/
WidgetLite.CLASS_NAMES = {};

Y.extend(WidgetLite, Y.EventTarget, {

    /**
    A selector that matches the content box of the plugin.
    If set to `null` the `contentBox` property will point to
    the bounding box.

    @property CONTENT_SELECTOR
    @type String
    @protected
    **/
    CONTENT_SELECTOR: '> *',

    /**
    Normalizes class names according to what Y.Widget does
    It loops over the prototype chain and adds classes like yui3-{ns} to the
    bounding box and yui3-{ns}-content to the content box where {ns}
    is the namespace of the plugin (its NS property).
    It also adds classes based on the CLASS_NAMES static property
    (see [CLASS_NAMES](#property_CLASS_NAMES)).

    @method _renderClassNames
    @private
    **/
    _renderClassNames: function () {
        var self = this,
            boundingBox = this.boundingBox;

        function addClassByName(className) {
            this.addClass(self.getClassName(className));
        }

        function addClassesFromOptions(classNames, selector) {
            var nodes = boundingBox.all(selector);
            if (Y.Lang.isArray(classNames)) {
                Y.Array.each(classNames, addClassByName, nodes);
            } else {
                addClassByName.call(nodes, classNames);
            }
        }

        this.contentBox.addClass(this.getClassName('content'));

        Y.Array.each(this.constructor._classes, function (_class) {
            boundingBox.addClass(getClassName(_class.NS));
            Y.Object.each(_class.CLASS_NAMES, addClassesFromOptions);
        });
    },

    /**
    Returns a normalized class name based on Y.ClassNameManager.
    Takes any number of string arguments.

    @method getClassName
    @param {String} classes*
    @return String
    **/
    getClassName: function () {
        return getClassName.apply(Y.ClassNameManager, [this._cssPrefix]
                .concat(slice.call(arguments)));
    },

    /**
    @method init
    @private
    **/
    init: function (config) {
        var self = this,
            superclass = this.constructor,
            classes = [];

        if (!this.constructor._classes) {
            while (superclass && superclass !== WidgetLite.superclass.constructor) {
                classes.push(superclass);
                superclass = superclass.superclass && superclass.superclass.constructor;
            }
            /**
            A list with all the constructors in the prototype chain

            @property _classes
            @type Array
            @private
            @static
            **/
            this.constructor._classes = classes.reverse();
        }

        Y.Array.each(this.constructor._classes, function (_class) {
            // Use a variable instead of a string literal as per YUI source 
            // documentation
            // See source for BaseCore
            if (_class.prototype.hasOwnProperty(INITIALIZER)) {
                _class.prototype.initializer.call(self, config);
            }
        });

        this.render();
    },

    renderUI: function () {},

    bindUI: function () {},

    syncUI: function () {},

    /**
    @method render
    @protected
    @chainable
    **/
    render: function () {
        this._renderClassNames();

        this.renderUI();
        this.bindUI();
        this.syncUI();

        return this;
    },

    /**
    @method destroy
    **/
    destroy: function () {
        var self = this;

        Y.Array.each(this._handles, function (handle) {
            handle.detach();
        });

        Y.Array.each(this.constructor._classes, function (_class) {
            if (_class.prototype.hasOwnProperty(DESTRUCTOR)) {
                _class.prototype.destructor.call(self);
            }
        });

        if (this.contentBox !== this.boundingBox) {
            this.contentBox.destroy();
        }

        this.contentBox = this.boundingBox = this._handles = null;
    }

});

Y.Lite = {
    Widget: WidgetLite
};