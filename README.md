# `jupyterhub-fancy-profiles`

A react based, fancy implementation of user selectable profiles
for use with [jupyterhub-kubespawner](https://github.com/jupyterhub/kubespawner).

![Screenshot showing an image selector](screenshot.png)

## Features

1. Interpret a `profileList` given to kubespawner, and render a better looking
   and more featureful selector. This includes descriptions for various options,
   as well as better descriptions for allowing users to 'write-in' a choice.

2. If enabled, interact with a [binderhub](https://github.com/jupyterhub/binderhub/)
   deployed as a JupyterHub service to allow users to _dynamically_ build images
   they want to use, without requiring it to be pre-built.

## Limitations

1. While multiple `profile_options` are supported, only a single `profile` is
   supported.

2. The forms values don't remember their previous state upon refresh

## How to use

Once installed, you can have kubespawner use the templates shipped
with this package to provide appropriate UI, by adding the following snippet
to your `jupyterhub_config.py` file:

```python
from jupyterhub_fancy_profiles import setup_ui
setup_ui(c)
```

The `setup_ui` function will setup all the appropriate config as needed. Currently,
it will:

1. Setup extra templates to be made available to kubespawner, to render the
   base HTML for `profile_list`.
2. Setup extra HTTP handlers, primarily for serving our static assets.

## What is in here?

The primary contents are:

1. `jupyterhub_fancy_profiles/templates` contains jinja2 templates, primarily
   `HTML` for constructing the form itself. This can contain multiple templates
   that are composed together using all of jinja2's composition features (like `include`)
2. `src/` contains JS and CSS that are packaged via standard frontend bundling
   tools (`webpack` and `babel`), outputing assets into `jupyterhub_fancy_profiles/static/`.
   This allows us to use _standard_ frontend tooling to write JS & CSS - for
   example, [xterm.js](http://xtermjs.org/) can be used without many complications.

## Why React?

> /\* If this file gets over 200 lines of code long (not counting docs / comments), start using a framework

(from the [BinderHub JS Source Code](https://github.com/jupyterhub/binderhub/blob/036877ffdf0abfde7e84f3972c7d0478cf4f7cb2/binderhub/static/js/index.js#L1))

Dear Reader, the file _did_ get more than 200 lines long, but alas there was no
time to start using a framework. Lesson learnt from that is we should use a
_very lightweight_ framework right from the start, something mainstream that
can attract frontend devs without being so fancy that nobody else can work on
it. Given the size and complexity of this - a complex UI but only a single page -
plain react without typescript seems the correct choice. We will _not_ make
this into a super-heavy, complex application - just a fairly simple one that
uses react.
