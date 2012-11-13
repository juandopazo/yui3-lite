YUI3 Lite
=========

Ongoing development of a lightweight version of YUI components. The objective
is to provide a tiered API for YUI widgets based on three levels from simpler
to more complex:

  1. A bootstrapper script that automagically makes elements of the page
     interactive
  2. A series of plugins not based on Y.Plugin.Base that are lightweight and
     performant, with a simple API focused on the 80/20 of the tasks that
     are needed for widgets. Complex interaction with other components is not a
     priority. They should normalize classes and provide ARIA support.
  3. Fully fledged widgets oriented towards complex interactions between
     components.