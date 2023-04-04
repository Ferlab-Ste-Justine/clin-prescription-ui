/// <reference types="Cypress" />
import '../../support/commands';

const prescs_CUSM_RGDI = JSON.parse(Cypress.env('prescs_CUSM_RGDI'));

beforeEach(() => {
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));

  cy.visitPrescriptionsPage();

  cy.checkValueFacet(0, 'Approuvée');
  cy.checkValueFacet(2, 'RGDI');
  cy.checkValueFacet(3, 'LDM-CUSM');

  cy.get('div[id*="tab-requests"]').click({force: true});
  cy.resetColumns(1);

  cy.intercept('**/user').as('getUser2');
  cy.get('div[class="ant-popover-inner"]').eq(1)
    .find('div[class="ant-space-item"]').contains('Modifiée le')
    .find('[type="checkbox"]').check({force: true});
  cy.wait('@getUser2', {timeout: 20*1000});

  cy.intercept('**/user').as('getUser3');
  cy.get('div[class="ant-popover-inner"]').eq(1)
    .find('div[class="ant-space-item"]').contains('Requérant')
    .find('[type="checkbox"]').check({force: true});
  cy.wait('@getUser3', {timeout: 20*1000});

  cy.intercept('**/user').as('getUser4');
  cy.get('div[class="ant-popover-inner"]').eq(1)
    .find('div[class="ant-space-item"]').contains('Prénatal')
    .find('[type="checkbox"]').check({force: true});
  cy.wait('@getUser4', {timeout: 20*1000});

  cy.intercept('**/user').as('getUser5');
  cy.get('div[class="ant-popover-inner"]').eq(1)
    .find('div[class="ant-space-item"]').contains('Dossier')
    .find('[type="checkbox"]').check({force: true});
  cy.wait('@getUser5', {timeout: 20*1000});

  cy.get('body').contains('Requêtes (9)').should('exist');
});

afterEach(() => {
  cy.logout();
});

describe('Tableau des requêtes', () => {
  describe('Vérifier les informations affichées', () => {

    it('D\'une requête aléatoire d\'une prescription aléatoire', () => {
      const randomPresc = Math.floor(Math.random() * 3);
      const randomReq = Math.floor(Math.random() * 3);
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains(prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId).should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains(prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].sampleId).should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains(prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].patientId).should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains('Complétée').should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains(prescs_CUSM_RGDI.stampDate).should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains(prescs_CUSM_RGDI.stampDate).should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains('RGDI').should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains('LDM-CUSM').should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains('CUSM').should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains(prescs_CUSM_RGDI.prescriptions[randomPresc].prescriptionId).should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains('Fichiers').should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains('Variants').should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains('Non').should('exist');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').contains(prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].mrn).should('exist');
    });
  });
  
  describe('Valider les liens disponibles', () => {

    it('Lien Requête d\'une requête aléatoire d\'une prescription aléatoire', () => {
      const randomPresc = Math.floor(Math.random() * 3);
      const randomReq = Math.floor(Math.random() * 3);
      cy.intercept('POST', '**/$graphql').as('getPOSTgraphql');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').find('a[href*="prescription"]').eq(0).click({force: true});
      cy.wait('@getPOSTgraphql', {timeout: 20*1000});

      cy.contains('Prescription ID : '+prescs_CUSM_RGDI.prescriptions[randomPresc].prescriptionId).should('exist', {timeout: 20*1000});
    });

    it('Lien Prescription d\'une requête aléatoire d\'une prescription aléatoire', () => {
      const randomPresc = Math.floor(Math.random() * 3);
      const randomReq = Math.floor(Math.random() * 3);
      cy.intercept('POST', '**/$graphql').as('getPOSTgraphql');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').find('a[href*="prescription"]').eq(1).click({force: true});
      cy.wait('@getPOSTgraphql', {timeout: 20*1000});

      cy.contains('Prescription ID : '+prescs_CUSM_RGDI.prescriptions[randomPresc].prescriptionId).should('exist', {timeout: 20*1000});
    });

    it('Lien Fichiers d\'une requête aléatoire d\'une prescription aléatoire', () => {
      const randomPresc = Math.floor(Math.random() * 3);
      const randomReq = Math.floor(Math.random() * 3);
      cy.intercept('POST', '**/$graphql').as('getPOSTgraphql');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').find('a[href*="archive"]').click({force: true});
      cy.wait('@getPOSTgraphql', {timeout: 20*1000});
      cy.contains(prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].patientId).should('exist', {timeout: 20*1000});
    });

    it('Lien Variants d\'une requête aléatoire d\'une prescription aléatoire', () => {
      const randomPresc = Math.floor(Math.random() * 3);
      const randomReq = Math.floor(Math.random() * 3);
      cy.intercept('POST', '**/$graphql').as('getPOSTgraphql');
      cy.get('tr[data-row-key="'+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].requestId+'"]').find('a[href*="snv"]').click({force: true});
      cy.wait('@getPOSTgraphql', {timeout: 20*1000});
      cy.wait('@getPOSTgraphql', {timeout: 20*1000});
      cy.contains('Patient ID : '+prescs_CUSM_RGDI.prescriptions[randomPresc].requests[randomReq].patientId).should('exist', {timeout: 20*1000});
    });
  });
});