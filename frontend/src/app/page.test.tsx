import { describe, it } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from './page' // Importa a sua tela real

// "describe" agrupa os testes de uma mesma funcionalidade
describe('Tela Inicial do Ouvidoria 360', () => {
  
  // "it" ou "test" é o teste em si
  it('deve renderizar o título de boas-vindas na tela', () => {
    
    // 1. Simula a renderização da página
    render(<Home />)

    // 2. Procura na tela um elemento de cabeçalho (h1, h2) que contenha o texto
    const titulo = screen.getByRole('heading', { 
      name: /Bem-vindo ao Ouvidoria 360/i ,
    })
    const paragrafo = screen.getByText(/O sistema está pronto para ser desenvolvido!/i)

    // 3. Afirmação: O título deve estar visível no documento
    expect(titulo).toBeInTheDocument()
    expect(paragrafo).toBeInTheDocument()
  })
})