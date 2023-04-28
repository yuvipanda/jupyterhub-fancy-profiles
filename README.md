# prototype-kubespawner-dynamic-building-ui

## Goals

This is a pure **prototype**, exploring answers to the following
questions:

1. How to sustainably develop complex UIs that sit in the kubespawner
   profile selector page without requiring strong coupling with kubespawner
   itself, or unmaintainable stuff that is copy pasted into YAML config?

2. How to bundle JS & CSS properly into this kinda UI, so we can use modern
   frontend practices to build the UI without having to do weird tricks?

We could answer other questions in the future, but this is what is needed
right now.

## How to use

Once installed, you can have kubespawner use the templates shipped
with this package to provide appropriate UI.

```python
from kubespawner_dynamic_building_ui import TEMPLATE_PATHS
c.KubeSpawner.additional_profile_form_template_paths = TEMPLATE_PATHS
```
