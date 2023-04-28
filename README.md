# prototype-kubespawner-dynamic-building-ui

## How to use

Once installed, you can have kubespawner use the templates shipped
with this package to provide appropriate UI.

```python
from kubespawner_dynamic_building_ui import TEMPLATE_PATHS
c.KubeSpawner.additional_profile_form_template_paths = TEMPLATE_PATHS
```
