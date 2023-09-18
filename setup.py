from setuptools import find_packages, setup

setup(
    name="jupyterhub-kubespawner-dynamic-building-ui",
    version="1.0.0",
    description="UI that plugs into kubespawner profile list for",
    url="https://github.com/jupyterhub/tmpauthenticator",
    author="Yuvi Panda",
    author_email="yuvipanda@gmail.com",
    license="3 Clause BSD",
    packages=find_packages(),
    include_package_data=True,
)
