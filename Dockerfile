FROM docker.io/library/buildpack-deps:jammy

ENV DEBIAN_FRONTEND noninteractive

ARG NODE_VERSION="18.16.0"
ARG PNPM_VERSION="8.6.1"
ARG YARN_VERSION="1.22.19"
ARG NPM_VERSION="9.6.7"

RUN curl -L https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.gz | tar xz -C /usr/local --strip-components=1 && \
  unlink /usr/local/CHANGELOG.md && unlink /usr/local/LICENSE && unlink /usr/local/README.md
RUN corepack enable pnpm yarn npm && \
    corepack prepare pnpm@${PNPM_VERSION} --activate && \
    corepack prepare yarn@${YARN_VERSION} --activate && \
    corepack prepare npm@${NPM_VERSION}

# wine
RUN dpkg --add-architecture i386 && \
    mkdir -pm755 /etc/apt/keyrings && \
    wget -O /etc/apt/keyrings/winehq-archive.key https://dl.winehq.org/wine-builds/winehq.key && \
    wget -NP /etc/apt/sources.list.d/ https://dl.winehq.org/wine-builds/ubuntu/dists/jammy/winehq-jammy.sources
RUN apt-get update -y && \
    apt-get install -y --install-recommends winehq-stable && \
    apt-get -y autoremove && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# add user
ENV USER_NAME=builder
ARG USER_UID=1000
RUN useradd -m -s /bin/zsh -u ${USER_UID} ${USER_NAME}

RUN mkdir -p /project && chown -R ${USER_UID}:${USER_UID} /project


USER ${USER_NAME}
WORKDIR /project

# for electron builder
# ...
