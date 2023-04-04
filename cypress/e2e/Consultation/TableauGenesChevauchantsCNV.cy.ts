/// <reference types="Cypress" />
import '../../support/commands';

const epCHUSJ_ldmCHUSJ = JSON.parse(Cypress.env('presc_EP_CHUSJ_LDM_CHUSJ'));

beforeEach(() => {
  cy.login(Cypress.env('username_DG_CHUSJ_CUSM_CHUS'), Cypress.env('password'));
  cy.visitCNVsPatientPage(epCHUSJ_ldmCHUSJ.patientProbId, epCHUSJ_ldmCHUSJ.prescriptionId, 3);

  cy.get('body').find('span[class*="ant-select-selection-item"]').click({force: true});
  cy.get('body').find('div[class*="ant-select-item-option-content"]').contains('100').click({force: true});

  cy.get('thead[class="ant-table-thead"]').contains('Début').click({force: true});
});

afterEach(() => {
  cy.logout();
});

describe('Tableau des gènes chevauchant un CNV', () => {
  it('Vérifier les informations affichées', () => {
    cy.get('thead[class="ant-table-thead"]').contains('Début').click({force: true});
    cy.get('tr[data-row-key="00b535001879d47abebd243f45e148428500448a"]').contains(/^2$/).click({force: true});

    cy.get('div[role="dialog"]').find('tr[data-row-key="0"]').contains('OCLN').should('exist');
    cy.get('div[role="dialog"]').find('tr[data-row-key="0"]').contains('RGDI').should('exist');
    cy.get('div[role="dialog"]').find('tr[data-row-key="0"]').contains('65.6 kb').should('exist');
    cy.get('div[role="dialog"]').find('tr[data-row-key="0"]').contains('6.6 kb').should('exist');
    cy.get('div[role="dialog"]').find('tr[data-row-key="0"]').contains(/^2$/).should('exist');
    cy.get('div[role="dialog"]').find('tr[data-row-key="0"]').contains('10.1 %').should('exist');
    cy.get('div[role="dialog"]').find('tr[data-row-key="0"]').contains('24.2 %').should('exist');
  });
 
  it('Valider les liens disponibles', () => {
    cy.get('thead[class="ant-table-thead"]').contains('Début').click({force: true});
    cy.get('tr[data-row-key="00b535001879d47abebd243f45e148428500448a"]').contains(/^2$/).click({force: true});

    cy.get('div[role="dialog"]').find('tr[data-row-key="0"]').contains('OCLN').invoke('removeAttr', 'target').click({force: true});
    cy.get('body').contains(/^OCLN$/).should('exist');
  });
  
  describe('Valider les fonctionnalités du tableau', () => {
    it('Les tris', () => {
      cy.get('thead[class="ant-table-thead"]').contains('Début').click({force: true});
      cy.get('tr[data-row-key="00b535001879d47abebd243f45e148428500448a"]').contains(/^2$/).click({force: true});

      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('Gène').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('GTF2H2C').should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('Gène').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('OCLN').should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('Gène').click({force: true});

      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('Longueur du gène').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('35.0 kb').should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('Longueur du gène').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('65.6 kb').should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('Longueur du gène').click({force: true});

      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('# Bases').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('6.6 kb').should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('# Bases').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('18.6 kb').should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('# Bases').click({force: true});

      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('# Exons').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains(/^2$/).should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('# Exons').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains(/^10$/).should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('# Exons').click({force: true});

      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('% Gène').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('10.1 %').should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('% Gène').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('53.2 %').should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('% Gène').click({force: true});

      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('% CNV').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('24.2 %').should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('% CNV').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('68.2 %').should('exist');
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('% CNV').click({force: true});
    });

    it('Le tri multiple', () => {
      cy.get('tr[data-row-key="498403813965c489afc0ba3c70fddbc181703e39"]').contains(/^38$/).click({force: true});

      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('# Exons').click({force: true});
      cy.get('div[role="dialog"]').find('thead[class="ant-table-thead"]').contains('Gène').click({force: true});
      cy.get('div[role="dialog"]').find('tr[class*="ant-table-row"]').eq(0).contains('FAM66B').should('exist');
    });
  
    it('La pagination', () => {
      cy.get('tr[data-row-key="498403813965c489afc0ba3c70fddbc181703e39"]').contains(/^38$/).click({force: true});

      cy.get('div[role="dialog"]').find('[class*="ant-pagination-item-2"]').click({force: true});
      cy.get('div[role="dialog"]').find('div[class*="ProTableHeader"]').contains('Résultats 21 - 38 de 38').should('exist');

      cy.get('div[role="dialog"]').find('[class*="anticon-left"]').click({force: true});
      cy.get('div[role="dialog"]').find('div[class*="ProTableHeader"]').contains('Résultats 1 - 20 de 38').should('exist');

      cy.get('div[role="dialog"]').find('[class*="anticon-right"]').click({force: true});
      cy.get('div[role="dialog"]').find('div[class*="ProTableHeader"]').contains('Résultats 21 - 38 de 38').should('exist');
    });
  });
});