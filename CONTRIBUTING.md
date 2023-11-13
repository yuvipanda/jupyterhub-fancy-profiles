# Contributing

## Setting up a dev environment

### Setting up `minikube`

Currently, these instructions only work with [minikube](https://minikube.sigs.k8s.io/docs/start/)
but can be adapted to work with any other local kubernetes setup.

1. Download, set up and start [minikube](https://minikube.sigs.k8s.io/docs/start/)

2. Allow the spawned JupyterHub server pods to talk to the JupyterHub instance on your
   local machine with the following command:

   ```bash
   # Linux
   sudo ip route add $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}") via $(minikube ip)

   # MACOS
   sudo route -n add -net $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}") $(minikube ip)
   ```

   You can later undo the effects of this with the following command

   ```bash
   # Linux
   sudo ip route del $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}")

   # MACOS
   sudo route delete -net $(kubectl get node minikube -o jsonpath="{.spec.podCIDR}")
   ```

### Setup a virtual environment

1. Clone this repository

2. Setup a virtual environment, in whatever way works for you (`venv`, `conda`, etc)

3. Install the packages specified in `dev-requirements.txt`

   ```bash
   python -m pip install -r dev-requirements.txt
   ```

4. Install [configurable-http-proxy](https://github.com/jupyterhub/configurable-http-proxy/),
   as that is required for JupyterHub to run.

   ```bash
   npm install configurable-http-proxy
   ```

5. Put `configurable-http-proxy` in `$PATH` so jupyterhub can discover it.

   ```bash
   export PATH="$(pwd)/node_modules/.bin:${PATH}"
   ```

6. Now, start `jupyterhub` and go to `localhost:8000` to access it! You can login with any
   username and password.

   ```bash
   jupyterhub
   ```
