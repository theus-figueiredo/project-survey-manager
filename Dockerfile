FROM node:20-bookworm-slim

WORKDIR /usr/src/app

# Ferramentas comuns que ajudam a instalação do servidor remoto e depuração no devcontainer.
RUN apt-get update \
  && apt-get install -y --no-install-recommends bash git curl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Habilita o Yarn via Corepack sem depender da instalação local da máquina.
RUN corepack enable && corepack prepare yarn@1.22.22 --activate

# Copia primeiro apenas o manifesto para aproveitar cache de dependências.
COPY package.json ./

RUN yarn install

# Copia o restante do código após instalar dependências.
COPY . .

EXPOSE 3000

CMD ["yarn", "start:dev"]
