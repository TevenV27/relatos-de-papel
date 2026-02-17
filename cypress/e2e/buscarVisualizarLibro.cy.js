describe('CU-01 Buscar y visualizar libros', () => {

  beforeEach(() => {
    // Login antes de cada escenario
    cy.visit('http://localhost:5173/login')

    cy.get('input[type="email"]').type('test@test.com')
    cy.get('input[type="password"]').type('123456')
    cy.contains('INICIAR SESIÓN').click()

    cy.url().should('include', '/home')
  })

  it('Escenario exitoso: Debe mostrar resultados y permitir ver detalle', () => {

    cy.get('input[placeholder="Buscar libros, autores..."]')
      .type('Don Quijote{enter}')

    cy.contains('Don Quijote')
      .should('be.visible')

    cy.contains('Don Quijote').click()

    cy.url().should('include', 'book')

  })

  it('Escenario alternativo: Debe mostrar mensaje cuando no hay resultados', () => {

    cy.get('input[placeholder="Buscar libros, autores..."]')
      .type('LibroInexistenteXYZ{enter}')

    cy.contains('No se encontraron')
      .should('be.visible')

  })

})
