beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_2.html')
})

/*
Assignement 4: add content to the following tests
*/

describe('Section 1: Functional tests', () => {

    it('User can use only same both first and validation passwords', ()=>{
        cy.get('#username').type('Tony_test')
        cy.get('#email').type('test@test.ee')
        cy.get('input[name="name"]').type('Anton')
        cy.get('[data-testid="lastNameTestId"]').type('Surgutsov')
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        cy.get('input[name="password"]').type('TestPass123')
        cy.get('input[name="confirm"]').type('TestPass1234')

        cy.get('[name="confirm"]').type('{enter}')
        cy.get('#password_error_message').should('be.visible').and('contain', 'Passwords do not match!')
        cy.get('#success_message').should('not.be.visible')
        cy.get('.submit_button').should('be.disabled')
        
        cy.get('input[name="confirm"]').type('{backspace}').blur()
        cy.get('#password_error_message').should('not.be.visible')
        cy.get('.submit_button').should('be.enabled')
    })
    

    it('User can submit form with all fields added', ()=>{
        cy.get('#username').type('Tony_test')
        cy.get('#email').type('test@test.ee')
        cy.get('input[name="name"]').type('Anton')
        cy.get('[data-testid="lastNameTestId"]').type('Surgutsov')
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        
        cy.get('[type="radio"]').check('php')
        cy.get('#vehicle2').check()
        cy.get('#cars').select('audi').should('have.value', 'audi')
        cy.get('#animal').select('dog').should('have.value', 'dog')

        cy.get('input[name="password"]').type('TestPass123')
        cy.get('input[name="confirm"]').type('TestPass123').blur()

        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible').and('contain', 'User successfully submitted registration')
    })
    

    it('User can submit form with valid data and only mandatory fields added', ()=>{
        inputValidData('Tony_test')

        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()
        cy.get('#success_message').should('be.visible').and('contain', 'User successfully submitted registration')
    })


    it('User cannot submit form when mandatory field username is absent', ()=>{
        inputValidData('Tony_test')

        cy.get('#username').scrollIntoView()
        cy.get('#username').clear().blur()

        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible').and('contain', 'Mandatory input field is not valid or empty!')
    })

    it('User cannot submit form when mandatory field email is absent', ()=>{
        inputValidData('Tony_test')

        cy.get('#email').scrollIntoView()
        cy.get('#email').clear().blur()

        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible').and('contain', 'Mandatory input field is not valid or empty!')
    })

    it('User cannot submit form when mandatory field first name is absent', ()=>{
        inputValidData('Tony_test')

        cy.get('input[name="name"]').scrollIntoView()
        cy.get('input[name="name"]').clear().blur()

        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible').and('contain', 'Mandatory input field is not valid or empty!')
    })

    it('User cannot submit form when mandatory field last name is absent', ()=>{
        inputValidData('Tony_test')

        cy.get('#lastName').scrollIntoView()
        cy.get('#lastName').clear().blur()

        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#input_error_message').should('be.visible').and('contain', 'Mandatory input field is not valid or empty!')
    })
})

/*
Assignement 5: create more visual tests
*/

describe('Section 2: Visual tests', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').and('include', 'cerebrum_hub_logo')
        cy.get('img').invoke('height').should('be.lessThan', 178)
            .and('be.greaterThan', 100)   
    })


    it('Check that second logo is correct and has correct size', () => {
        cy.log('Will check second logo source and size')
        cy.get('img').eq(1).should('have.attr', 'src').and('include', 'cypress_logo.png')
        cy.get('img').eq(1).invoke('height').should('be.lessThan', 100)
            .and('be.greaterThan', 50)
    });

    it('Check navigation part', () => {
        cy.get('nav').children().should('have.length', 2)
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        
        cy.get('nav').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'registration_form_1.html')
            .click()
        cy.url().should('contain', '/registration_form_1.html')
        
        cy.go('back')
        cy.url().should('contain', '/registration_form_2.html')
        cy.log('Back again in registration form 2')
    })


    it('Check navigation part for second link', () => {
        cy.get('nav').children().should('have.length', 2)
        cy.get('nav').siblings('h1').should('have.text', 'Registration form number 2')
        
        cy.get('nav').children().eq(1).should('be.visible')
            .and('have.attr', 'href', 'registration_form_3.html')
            .click()
        cy.url().should('contain', '/registration_form_3.html')
        
        cy.go('back')
        cy.url().should('contain', '/registration_form_2.html')
        cy.log('Back again in registration form 2')
    })

    it('Check that radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)

        cy.get('input[type="radio"]').next().eq(0).should('have.text','HTML')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','CSS')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','JavaScript')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','PHP')

        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })


    it('Check that the list of checkboxes is correct', () => {
        cy.get('.checkbox.vehicles').should('have.length', 3)

        cy.get('.checkbox.vehicles').eq(0).should('not.be.checked')
        cy.get('.checkbox.vehicles').eq(1).should('not.be.checked')
        cy.get('.checkbox.vehicles').eq(2).should('not.be.checked')

        cy.get('.checkbox.vehicles').next().eq(0).should('have.text','I have a bike')
        cy.get('.checkbox.vehicles').next().eq(1).should('have.text','I have a car')
        cy.get('.checkbox.vehicles').next().eq(2).should('have.text','I have a boat')

        cy.get('.checkbox.vehicles').eq(0).check().should('be.checked')
        cy.get('.checkbox.vehicles').eq(1).check().should('be.checked')
    })

    it('Car dropdown is correct', () => {
        cy.get('#cars').select(1).screenshot('Cars drop-down')
        cy.screenshot('Full page screenshot')

        // Here are given different solutions how to get the length of array of elements in Cars dropdown
        // Next 2 lines of code do exactly the same!
        cy.get('#cars').children().should('have.length', 4)
        cy.get('#cars').find('option').should('have.length', 4)

        cy.get('#cars').find('option').eq(0).should('have.text', 'Volvo')
        
        // Advanced level how to check the content of the Cars dropdown
        cy.get('#cars').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['volvo', 'saab', 'opel', 'audi'])
        })
    })


    it('Animals dropdown is correct', () => {
        cy.get('#animal').find('option').should('have.length', 6)
        
        // Verify all values in the dropdown
        cy.get('#animal').find('option').then(options => {
            const actual = [...options].map(option => option.value)
            expect(actual).to.deep.eq(['dog', 'cat', 'snake', 'hippo', 'cow', 'mouse'])
        })
    })

})

function inputValidData(username) {
    cy.log('Username will be filled')
    cy.get('input[data-testid="user"]').type(username)
    cy.get('#email').type('test@test.ee')
    cy.get('[data-cy="name"]').type('Anton')
    cy.get('#lastName').type('Surgutsov')
    cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
    cy.get('#password').type('TestPass123')
    cy.get('#confirm').type('TestPass123')
    cy.get('h2').contains('Password').click()
}