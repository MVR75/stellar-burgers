describe('Конструктор бургеров', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('Список ингредиентов отображается', () => {
    cy.get('[data-cy="ingredients-container"]').should('be.visible');
  });

  it('Добавление начинки в конструктор', () => {
    const ingredientId = '643d69a5c3f7b9001cfa093e';
    const ingredientName = 'Филе Люминесцентного тетраодонтимформа';

    cy.get(`[data-cy="ingredient-item"][data-ingredient-id="${ingredientId}"]`)
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });
    
    cy.get('[data-cy="constructor-fillings"]')
      .should('contain.text', ingredientName);
  });

  it('Добавление булочки в конструктор', () => {
    const ingredientId = '643d69a5c3f7b9001cfa093c';
    const ingredientName = 'Краторная булка N-200i';

    cy.get(`[data-cy="ingredient-item"][data-ingredient-id="${ingredientId}"]`)
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });
    
    cy.get('[data-cy="constructor-top"]').should('contain.text', ingredientName);
    cy.get('[data-cy="constructor-bottom"]').should('contain.text', ingredientName);
  });

  describe('Открытие и закрытие модального окна с ингредиентом', () => {
    beforeEach(() => {
      const ingredientId = '643d69a5c3f7b9001cfa093c';

      cy.get(`[data-cy="ingredient-item"][data-ingredient-id="${ingredientId}"]`)
      .within(() => {
        cy.get(`a[href*="/ingredients/${ingredientId}"]`).click();
      });
    });
    
    it('Модальное окно открылось с корректными данными', () => {
      const ingredientName = 'Краторная булка N-200i';
      const ingredientId = '643d69a5c3f7b9001cfa093c';

      cy.location('pathname').should('eq', `/ingredients/${ingredientId}`);
      cy.get('[data-cy="modal-container"]').should('be.visible');
      cy.get('[data-cy="modal-container"]').within(() => {
        cy.contains(ingredientName);
      });
    });
    
    it('Модальное окно закрывается по кнопке', () => {
      cy.get('[data-cy="modal-button-close"]').click();

      cy.location('pathname').should('eq', `/`);
      cy.get('[data-cy="modal-container"]').should('not.exist');
    });
  });
});

describe('Оформление заказа', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/api/orders', { fixture: 'order-response.json' }).as('orderBurger');

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
        win.document.cookie = 'accessToken=test-access-token';
      }
    });

    cy.wait('@getIngredients');
    cy.wait('@getUser');

    const ingredientId = '643d69a5c3f7b9001cfa093e';

    cy.get(`[data-cy="ingredient-item"][data-ingredient-id="${ingredientId}"]`)
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

    const bunId = '643d69a5c3f7b9001cfa093c';

    cy.get(`[data-cy="ingredient-item"][data-ingredient-id="${bunId}"]`)
      .within(() => {
        cy.contains('button', 'Добавить').click();
      });

    cy.get('[data-cy="constructor"]').contains('button', 'Оформить заказ').click();

    cy.wait('@orderBurger');
  });

  it('Модальное окно открылось с верным номером заказа', () => {
    const orderId = '104110';

    cy.get('[data-cy="modal-container"]')
      .should('be.visible')
      .and('contain.text', orderId);
  });

  it('Модальное окно с заказом закрывается по кнопке', () => {
    cy.get('[data-cy="modal-button-close"]').click();

    cy.get('[data-cy="modal-container"]').should('not.exist');
  });

  it('Конструктор очищается после успешного оформления заказа', () => {
    cy.get('[data-cy="constructor-top"]').should('contain.text', 'Выберите булки');

    cy.get('[data-cy="constructor-bottom"]').should('contain.text', 'Выберите булки');

    cy.get('[data-cy="constructor-fillings"]').should('contain.text', 'Выберите начинку');
  });
});
