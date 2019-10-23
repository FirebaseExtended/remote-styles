/// <reference types="Cypress" />

context('Remote Styles - Loader', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5033/loader.html');
  });

  it('cy.title() - get the title', () => {
    cy.title().should('include', 'Integration Tests');
  });

  describe('Window tests', () => {
    it('window.remoteStyles - should have the remote styles window object', () => {
      cy.window().should('have.property', 'remoteStyles');
      cy.window().should('have.property', 'firebase');
    });
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