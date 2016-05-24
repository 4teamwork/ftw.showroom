Introduction
============

.. contents:: Table of Contents

This package provides a javascript library to make gallery overlays such as `Lightbox <http://www.jacklmoore.com/colorbox/example1/>`_.
But the main difference is that you have full control over the rendering and fetching of gallery items.

The gallery is able to notify if the user has reached the first or last item. This can be useful when more items
should be loaded as a batch.

The items of the gallery can be extended or reset.

The gallery always tracks the active item.

An API provides a way to control the gallery from outside.


Installation
------------

Add the package as dependency to your setup.py:

.. code:: python

  setup(...
        install_requires=[
          'ftw.showroom',
        ])

or to your buildout configuration:

.. code:: ini

  [instance]
  eggs += ftw.showroom

and rerun buildout.

Install the Generic Setup profile.

Compatibility
-------------

Plone 4.3

.. image:: https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Plone-logo.svg/2000px-Plone-logo.svg.png
   :target: https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Plone-logo.svg/2000px-Plone-logo.svg.png
   :height: 50px


Links
-----

- Github: https://github.com/4teamwork/ftw.showroom
- Issues: https://github.com/4teamwork/ftw.showroom/issues
- Pypi: http://pypi.python.org/pypi/ftw.showroom
- Continuous integration: https://jenkins.4teamwork.ch/search?q=ftw.showroom


Copyright
----------

This package is copyright by `4teamwork <http://www.4teamwork.ch/>`_.

``ftw.showroom`` is licensed under GNU General Public License, version 2.

Client library
==============

Getting Started
---------------

The client library depends on `Grunt <http://gruntjs.com/>`_. Assuming
you already have **Node.js** installed on your system, run the following command:

.. code:: bash

  sudo npm install -g grunt

To install the dependencies, run the following command:

.. code:: bash

  npm install

And with **npm** you get the following packages:

- `Grunt <http://gruntjs.com/>`_ - JavaScript task runner.
- `Babel <https://babeljs.io/>`_ - ES6 Transpiler.
- `Browserify <http://browserify.org/>`_ - Dependency Bundler
- `Karma <http://karma-runner.github.io/>`_ - JavaScript test runner.
- `Jasmine <http://jasmine.github.io/>`_ - JavaScript test suite.
- `Chai <http://chaijs.com/>`_ - JavaScript Assertion Library.

Usage
-----

Run the following command to re-build the library:

.. code:: bash

  grunt build

Run the following command to watch for changes which trigger a rebuild:

.. code:: bash

  grunt

Build options
-------------

See https://github.com/substack/browserify-handbook for more information about browserify.

Source Maps
-----------

Browserify comes with a built-in support to generate source maps. It is already enabled by default, but feel free to disable source maps. Refer to `this article <https://developers.google.com/chrome-developer-tools/docs/javascript-debugging#source-maps>`_
to enable source maps in Google Chrome, if you haven't already done so.

Tests
-----

Run all tests

.. code:: bash

  grunt test

Run a specific test

.. code:: bash

  grunt test --grep="Name of your test"

Initialization
--------------

Creates an empty showroom instance with default options

.. code:: javascript

  let showroom = Showroom();

The showroom constructor accepts a `NodeList <https://developer.mozilla.org/en/docs/Web/API/NodeList>`_ or a `jQuery <http://api.jquery.com/jquery/>`_.
The items can provide a target as an HTML data attribute (**data-showroom-target**) to define the endpoint where the item will fetch its content from.
To make a title visible in the overlay provide a title as an HTML data attribute  (**data-showroom-title**).

.. code:: HTML

  <ul>
    <li class="item"
        data-showroom-target="http://target.com/1"
        data-showroom-title="title-1">
      <a>Item 1</a>
    </li>
    <li class="item"
        data-showroom-target="http://target.com/2"
        data-showroom-title="title-2">
      <a>Item 2</a>
    </li>
  </ul>

.. code:: javascript

  let items = document.querySelectorAll(".item");
  let showroom = Showroom(items);

or

.. code:: javascript

  let items = $(".item");
  let showroom = Showroom(items);

Configuration
-------------

The showrooms provide the following options.

+----------+--------------------------+--------------------------------------------------------------------------+
| Option   | Default                  | Description                                                              |
+==========+==========================+==========================================================================+
| cssClass | "ftw-showroom"           | Class attribute on the root element of the gallery                       |
+----------+--------------------------+--------------------------------------------------------------------------+
| render   | See rendering_. section  | Override the default render behavior                                     |
+----------+--------------------------+--------------------------------------------------------------------------+
| tail     | Empty function           | Called when the user reaches the last element of the gallery             |
+----------+--------------------------+--------------------------------------------------------------------------+
| head     | Empty function           | Is getting called when the user reaches the first element of the gallery |
+----------+--------------------------+--------------------------------------------------------------------------+
| fetch    | See fetching_. section   | Override the default fetch behavior                                      |
+----------+--------------------------+--------------------------------------------------------------------------+
| template | See template section     | Override the default gallery template                                    |
+----------+--------------------------+--------------------------------------------------------------------------+
| target   | body Element             | Define a selector where the gallery will be attached                     |
+----------+--------------------------+--------------------------------------------------------------------------+

.. _fetching:

Fetching
--------

The default fetching function uses the target provided by each item to make an AJAX call to retrieve its content.

.. code:: javascript

  function fetch(item) { return $.get(item.target); };

This function can be overridden, see Configuration_.

.. code:: javascript

  let showroom = Showroom(items,
    {
      fetch: () => { return "<p>Some other content</p>"; }
    }
  );


.. _rendering:

Rendering
---------

The default rendering function returns an HTML string using the default `Handlebars <http://handlebarsjs.com/>`_ template
padding the internal showroom data, the prefeteched content and the active item.

.. code:: javascript

  function render(content) {
    return $.when(content).pipe((content) => {
      return $(template({ showroom: data, content: content, item: register.current }));
    });
  }

This function can be overridden, see Configuration_.

.. code:: javascript

  let showroom = Showroom(items,
    {
      fetch: () => { return "<p>Some other content</p>"; }
    }
  );

API
---

**Showroom.open**

Opens a specific item. If no item is specified the showroom tries to show the first in the store
otherwise it does nothing.

.. code:: javascript

  showroom.open();

or

.. code:: javascript

  showroom.open(item);

------------

**Showroom.close**

Closes the overlay by hiding the element.

.. code:: javascript

  showroom.close();

------------

**Showroom.next**

Opens the next item in the item queue. When the pointer reaches the last item the showroom does nothing.

.. code:: javascript

  showroom.next();

------------

**Showroom.prev**

Opens the previous item in the item queue. When the pointer reaches the first item the showroom does nothing.

.. code:: javascript

  showroom.prev();

------------

**Showroom.append**

Extend the current item queue with new items. The items are appended at the end of the queue.
The pointer remains unaffected.
The append method accepts a `NodeList <https://developer.mozilla.org/en/docs/Web/API/NodeList>`_ or a `jQuery <http://api.jquery.com/jquery/>`_

.. code:: javascript

  let newItems = document.querySelectorAll(".newItems");
  showroom.append(newItems);

or

.. code:: javascript

  let newItems = $(".newItems");
  showroom.append(newItems);

------------

**Showroom.reset**

Reset the current item store with new items. The overlay will be closed and the pointer set to `0`.
To empty the item store reset with no arguments.

.. code:: javascript

  let newItems = document.querySelectorAll(".newItems");
  showroom.reset(newItems);

or

.. code:: javascript

  let newItems = document.querySelectorAll(".newItems");
  showroom.reset();

------------

**Showroom.destroy**

After destroying the showroom is no longer able to open any items. The store will be reset and the marker class removed.
The overlay will be closed as well.
All items will loose their `data-showroom-id`.

.. code:: javascript


  showroom.destroy();

------------

**Showroom.setTotal**

Updates the total value and rerenders the opened overlay.
The method does only allow numeric values.

.. code:: javascript

  showroom.setTotal(34);
