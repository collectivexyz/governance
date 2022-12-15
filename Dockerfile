ARG VERSION=stable-slim
FROM debian:${VERSION}
ARG NPM_TOKEN
ARG PROJECT=governance

RUN export DEBIAN_FRONTEND=noninteractive && \
    apt update && \
    apt install -y -q --no-install-recommends \
    sudo git \
    npm build-essential git curl \
    ca-certificates apt-transport-https \
    ripgrep && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*

RUN useradd --create-home -s /bin/bash mr
RUN usermod -a -G sudo mr
RUN echo '%mr ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

RUN mkdir -p /usr/local/nvm
ENV NVM_DIR=/usr/local/nvm

ENV NODE_VERSION=v18.12.1

ADD https://raw.githubusercontent.com/creationix/nvm/master/install.sh /usr/local/etc/nvm/install.sh
RUN bash /usr/local/etc/nvm/install.sh && \
    bash -c ". $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default"

ENV NVM_NODE_PATH ${NVM_DIR}/versions/node/${NODE_VERSION}
ENV NODE_PATH ${NVM_NODE_PATH}/lib/node_modules
ENV PATH      ${NVM_NODE_PATH}/bin:$PATH

ENV NPM_TOKEN=${NPM_TOKEN}
# used by github
ENV NODE_AUTH_TOKEN=${NPM_TOKEN}

RUN npm install npm -g
RUN npm install yarn -g

WORKDIR /workspace/${PROJECT}
RUN chown -R mr.mr .
USER mr

COPY --chown=mr:mr . .

# typescript build
RUN yarn install --dev
RUN yarn prettier:check
RUN yarn lint
RUN yarn build
RUN yarn test

CMD echo "@collectivexyz/governance"
