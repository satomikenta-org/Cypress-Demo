

describe('Login Page', () => {

  beforeEach(() => {
    cy.visit('http://localhost:8080/login');
    cy.fixture("users/admin").as("admin");
  })

  it('login and logout successfully', function(){  // not arrow function in order to "this".admin 
    cy
      .get('#email') // get by id (ex id="email")
      .type(this.admin.email)
      .should("have.value", this.admin.email);

    cy
      .get('#password')
      .type(this.admin.password)
      .should("have.value", this.admin.password);

    cy.get("#login_btn").click();

    cy.location("pathname").should("eq", "/");
    cy.contains('みんなへ質問')
    .then(() => {
      const jwt = window.localStorage.getItem('jwt')
      expect(jwt).to.be.a('string');
    })

    cy.get('#username_btn').contains("管理者");

    cy.wait(1000)
    .then(() => {
      const jwt = window.localStorage.getItem('jwt');
      const headers = {'Authorization': `Bearer ${jwt}`};
      cy.request('http://localhost:3000/users/me', {
        headers
      })
      .then( (res) => {
        expect(res.data).to.have.property('first_name', '管理者');
      })
    })
    
    cy.get('#drawer_btn').click(); 
    cy.contains('#drawer_item', 'ログアウト').click() // id="drawer_btn" && innerText "ログイン"; 

    cy.contains('#login_btn','ログイン');
  })

  it('should show article detail and go back', function(){
    cy.visit('http://localhost:8080/');
    // you can get selector from selector playground in cypress browser like bellow.
    cy.get(':nth-child(1) > [style="display: flex; margin-top: 5px; margin-left: 7px; margin-right: 7px;"] > .row_content').click();
    cy.location('pathname').should("eq", "/article/120");
    cy.contains('先週土曜日に');
    cy.get('.v-toolbar__title > .v-icon').click();
    cy.location('pathname').should("eq", "/");
  });


  it('should change tab when click tabbtn', () => {
    cy.visit('http://localhost:8080/');
    cy.wait(1000) // you should wait to test some async call's result.
    cy.get(':nth-child(3) > .v-tabs__item').click();
    cy.wait(3000)
    cy.contains(':nth-child(2) > .v-card__title','ステロイド')

    // you can verify selector exists(visible);
    cy.get(':nth-child(2) > .v-card__title > [style="display: flex; flex-direction: column;"] > :nth-child(2) > [style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; width: 21vw;"] > [style="width: 20vw; max-width: 320px; display: flex; flex-direction: row; justify-content: flex-end; align-items: flex-end;"] > :nth-child(1) > .v-chip__content').should('exist')
    cy.get(':nth-child(2) > .v-card__title > [style="display: flex; flex-direction: column;"] > :nth-child(2) > [style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; width: 21vw;"] > [style="width: 20vw; max-width: 320px; display: flex; flex-direction: row; justify-content: flex-end; align-items: flex-end;"] > :nth-child(1) > .v-chip__content').should('be.visible')
  })

})

