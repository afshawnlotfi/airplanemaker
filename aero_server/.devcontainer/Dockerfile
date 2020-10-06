# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.134.1/containers/python-3/.devcontainer/base.Dockerfile
ARG VARIANT="3"
FROM mcr.microsoft.com/vscode/devcontainers/python:0-${VARIANT}


# [Optional] If your pip requirements rarely change, uncomment this section to add them to the image.
# COPY requirements.txt /tmp/pip-tmp/
# RUN pip --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
#    && rm -rf /tmp/pip-tmp

# [Optional] Uncomment this section to install additional OS packages.
RUN apt-get update \
    && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends freecad-python3 \
    && ln -s /usr/share/freecad/Gui /usr/lib/freecad-python3/Gui \
    && ln -s /usr/share/freecad/Mod /usr/lib/freecad-python3/Mod \
    && ln -s /usr/share/freecad/Ext /usr/lib/freecad-python3/Ext \

    && echo export PYTHONPATH=export PYTHONPATH=$PYTHONPATH:/usr/lib/freecad/lib >> ~/.bashrc \
    && bash -c "source ~/.bashrc" \
    && pip install --upgrade lxml \
    # && pip install lxml
    # python-numpy python-dev python-pyqt5 python-lxml build-essential libssl-dev libffi-dev libxml2-dev libxslt1-dev zlib1g-dev python-pip python-setuptools git 