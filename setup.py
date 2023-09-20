from setuptools import find_packages, setup

setup(
    name="jupyterhub-fancy-profiles",
    version="1.0.0",
    description="UI that plugs into kubespawner profile list for",
    url="https://github.com/yuvipanda/jupyterhub-fancy-profiles",
    author="Yuvi Panda",
    author_email="yuvipanda@gmail.com",
    license="3 Clause BSD",
    packages=find_packages(),
    include_package_data=True,
)
