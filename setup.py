"""
Setup.py to build generated js files with webpack.

Everything else is handled in pyproject.toml
"""

import os
from subprocess import check_call

from setuptools import setup
from setuptools.command.build_py import build_py
from setuptools.command.sdist import sdist

HERE = os.path.dirname(__file__)


def webpacked_command(command):
    """
    Return a command that inherits from command, but adds webpack JS building
    """

    class WebPackedCommand(command):
        """
        Run npm webpack to generate appropriate output files before given command.

        This generates all the js & css we need, and that is included via an
        entry in MANIFEST.in
        """

        description = "build frontend files with webpack"

        def run(self):
            """
            Call npm install & npm run webpack before packaging
            """
            check_call(
                ["npm", "install", "--progress=false", "--unsafe-perm"],
                cwd=HERE,
            )

            check_call(["npm", "run", "webpack"], cwd=HERE)

            return super().run()

    return WebPackedCommand


setup(
    cmdclass={
        # Handles making sdists and wheels
        "sdist": webpacked_command(sdist),
        # Handles `pip install` directly
        "build_py": webpacked_command(build_py),
    },
)
