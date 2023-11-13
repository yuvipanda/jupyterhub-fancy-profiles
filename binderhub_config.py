c = get_config()  # noqa

c.BinderHub.debug = True

# Just leave the built image in the node, so our hub can launch it
c.BinderHub.use_registry = False

c.BinderHub.base_url = "/services/binder/"

c.BinderHub.enable_api_only_mode = True
