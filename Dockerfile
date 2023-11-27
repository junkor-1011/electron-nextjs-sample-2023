FROM docker.io/electronuserland/builder:18-wine

ENV DEBIAN_FRONTEND noninteractive

ARG PNPM_VERSION="8.11.0"
ARG YARN_VERSION="1.22.19"
ARG NPM_VERSION="9.6.7"

RUN corepack enable pnpm yarn npm && \
    corepack prepare pnpm@${PNPM_VERSION} --activate && \
    corepack prepare yarn@${YARN_VERSION} --activate && \
    corepack prepare npm@${NPM_VERSION}


# add user
ENV USER_NAME=builder
ARG USER_UID=1000
RUN useradd -m -s /bin/bash -u ${USER_UID} ${USER_NAME}

RUN chown -R ${USER_NAME}:${USER_NAME} /project


USER ${USER_NAME}
WORKDIR /project
