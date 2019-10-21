/// <reference types="Cypress" />

context('Remote Styles', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  it('should successfully load the page', () => {
    cy.visit('/');
  });

  // describe('Window tests', () => {
  //   it('window.remoteStyles - should have the remote styles window object', () => {
  //     cy.window().should('have.property', 'remoteStyles');
  //   })
  // });

});