FROM public.ecr.aws/docker/library/node:18.12.1-slim

ARG PROJECT=collectivexyz_governance
ARG NPM=8.9.0

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && \
  apt install -y -q --no-install-recommends \
  sudo git gpg \
  ca-certificates curl ripgrep
RUN apt clean
RUN rm -rf /var/lib/apt/lists/*

RUN useradd --create-home -s /bin/bash mr
RUN usermod -a -G sudo mr
RUN echo '%mr ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

WORKDIR /workspace/${PROJECT}
RUN chown -R mr.mr .
USER mr

COPY --chown=mr:mr . .
RUN yarn install
RUN yarn prettier:check
RUN yarn lint
RUN yarn build

CMD yarn test
