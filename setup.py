"""
Setup.py to build generated js files with webpack.

Everything else is handled in pyproject.toml
"""
import os
from subprocess import check_call

from setuptools import setup
from setuptools.command.sdist import sdist

HERE = os.path.dirname(__file__)


class WebPackedSDist(sdist):
    """
    Run npm webpack to generate appropriate output files before sdist.

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


setup(
    cmdclass={"sdist": WebPackedSDist},
)
