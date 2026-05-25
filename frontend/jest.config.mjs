import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Diz ao Jest onde está o seu app Next.js para ele carregar as configurações (como o .env)
  dir: './',
})

const config = {
  // Simula um navegador (DOM) para podermos testar botões e telas
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

export default createJestConfig(config)