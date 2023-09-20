# jupyterhub-fancy-profiles

## Goals

This is a pure **prototype**, exploring answers to the following
questions:

1. How to sustainably develop complex UIs that sit in the kubespawner
   profile selector page without requiring strong coupling with kubespawner
   itself, or unmaintainable stuff that is copy pasted into YAML config?

2. How to bundle JS & CSS properly into this kinda UI, so we can use modern
   frontend practices to build the UI without having to do weird tricks?

3. How to package assets in such a way that admins can install these complex
   UIs without needing changes to JupyterHub or KubeSpawner?

4. How to best use custom jinja2 templates in KubeSpawner's profile_list,
   as enabled by [this PR](https://github.com/jupyterhub/kubespawner/pull/724)

We could answer other questions in the future, but this is what is needed
right now.

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

## Where this fits in

This project puts UI in the KubeSpawner's 'profile*list' page, which allows
users to select options they want to spawn their server with. As such, it
is \_injected* into the pre-existing HTML of that page. As of JupyterHub 4.0,
that page uses [Bootstrap 3](https://getbootstrap.com/docs/3.3/) for styling,
so that is what is available to us. We should [upgrade to Bootstrap 5](https://github.com/jupyterhub/jupyterhub/issues/4437)
at some point - until then, we have to use Bootstrap 3. Since this package and
JupyterHub are both versioned, we can easily transition once JupyterHub releases
a version with Bootstrap 5.

## Current state

This is how the app looks _right now_, to show how the user flow might be. Note
that we aren't quite at a stage to do proper UX yet, so **hold your UX thoughts
for now**. We're currently trying to figure out the technical parts of building
and deploying this sustainably, and figuring out UX will definitely be next!

![screenshot](screenshot.png)
