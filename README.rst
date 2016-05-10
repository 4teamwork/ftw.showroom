Introduction
============

.. contents:: Table of Contents

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

.. image:: https://jenkins.4teamwork.ch/job/ftw.showroom-master-test-plone-4.3.x.cfg/badge/icon
   :target: https://jenkins.4teamwork.ch/job/ftw.showroom-master-test-plone-4.3.x.cfg


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

Client libaray
==============

Getting Started
---------------

The project depends on `Grunt <http://gruntjs.com/>`_. Assuming
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

Run the following command to watch for changes:

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

.. code:: bash

  npm test
