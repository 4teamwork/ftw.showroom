from setuptools import find_packages
from setuptools import setup

import os

version = '1.5.1'
maintainer = 'Kevin Bieri'

tests_require = [
    'ftw.builder',
    'ftw.testing',
    'ftw.testbrowser',
    'plone.app.testing',
    'plone.testing',
    ]

extras_require = {
    'tests': tests_require,
    }

setup(name='ftw.showroom',
      version=version,
      description='Javascript library to make gallery overlays',
      long_description=open(
          'README.rst').read() + '\n' + open(
          os.path.join('docs', 'HISTORY.txt')).read(),

      # Get more strings from
      # http://www.python.org/pypi?%3Aaction=list_classifiers
      classifiers=[
          'Framework :: Plone',
          'Framework :: Plone :: 4.3',
          'License :: OSI Approved :: GNU General Public License (GPL)',
          'Programming Language :: Python',
          'Programming Language :: Python :: 2.7',
          'Topic :: Software Development :: Libraries :: Python Modules',
          ],

      keywords='ftw plone showroom',
      author='4teamwork AG',
      author_email='mailto:info@4teamwork.ch',
      maintainer=maintainer,
      url='https://github.com/4teamwork/ftw.showroom',
      license='GPL2',

      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['ftw', ],
      include_package_data=True,
      zip_safe=False,

      install_requires=[
          'Plone',
          'setuptools',
          'ftw.upgrade',
          ],

      tests_require=tests_require,
      extras_require=extras_require,

      entry_points="""
      # -*- Entry points: -*-
      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
