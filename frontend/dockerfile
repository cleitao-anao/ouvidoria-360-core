# 1. Escolhemos a imagem base oficial do Node (versão estável e leve com Alpine Linux)
FROM node:20-alpine

# 2. Define a pasta dentro do contêiner onde o projeto vai morar
WORKDIR /src/app

# 3. Copia apenas os arquivos de dependências primeiro (otimiza o cache do Docker)
COPY package*.json ./

# 4. Instala as dependências dentro do contêiner
RUN npm install

# 5. Copia o resto dos arquivos do seu projeto para dentro do contêiner
COPY . .

# 6. Avisa ao Docker que o contêiner vai escutar na porta 3000
EXPOSE 3000

# 7. Comando padrão para iniciar o Next.js em modo de desenvolvimento
CMD ["npm", "run", "dev"]