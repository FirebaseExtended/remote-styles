/// <reference types="Cypress" />

context('Remote Styles - Loader', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5033/webpack.html');
  });

  it('cy.title() - get the title', () => {
    cy.title().should('include', 'Integration Tests');
  });

  describe('Added styles', () => {
    it('should make the hello div red (rgb(255, 0, 0))', () => {
      cy.get('#hello').should('have.css', 'color', 'rgb(255, 0, 0)');
    });

    it('should make the div 2em/32px in font-size', () => {
      cy.get('#hello').should('have.css', 'font-size', '32px');
    });

    it('should make the div bold', () => {
      cy.get('#hello').should('have.css', 'font-weight', 'bold');
    });
  })

});