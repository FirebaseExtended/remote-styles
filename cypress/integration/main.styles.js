/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference types="Cypress" />

context('Remote Styles - Main', () => {

  beforeEach(() => {
    cy.visit('http://localhost:5033');
  });

  it('cy.title() - get the title', () => {
    cy.title().should('include', 'Integration Tests');
  });

  describe('Window tests', () => {
    it('window.remoteStyles - should have the remote styles window object', () => {
      cy.window().should('have.property', 'remoteStyles');
    });
  });

  describe('Added styles', () => {
    it('should make the hello div red (rgb(255, 0, 0))', () => {
      cy.wait(7000);
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