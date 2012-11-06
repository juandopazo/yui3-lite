TabView Plugin
==============

The TabView Plugin is a lightweight implementation of the TabView widget
meant to be used without interaction with other components and only
from existing markup.

The `Y.Lite.TabView` class is available for normalizing classnames. All the work
is done by the `Plugin.Tab` class. `Plugin.Tab` as any other widget plugin based
on `Y.Lite.Widget` doesn't extend `Plugin.Base` so it doesn't have attributes.
The consequence is that the selected status of the tab is based on the class name.

It's recommended that the whole markup, including classnames, is rendered in the
server side.