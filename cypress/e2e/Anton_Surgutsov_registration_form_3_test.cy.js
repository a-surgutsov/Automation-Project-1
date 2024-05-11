beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */

describe('Section 1: Visual tests for registration form 3', () => {
    it('Check that logo is correct and has correct size', () => {
        cy.log('Will check logo source and size')
        cy.get('img').should('have.attr', 'src').and('include', 'cerebrum_hub_logo.png')
        cy.get('img').invoke('height').should('be.lessThan', 180)
            .and('be.greaterThan', 160)   
    })

    it('Check that radio button list is correct', () => {
        cy.get('input[type="radio"]').should('have.length', 4)

        cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
        cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
        cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
        cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')

        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
        cy.get('input[type="radio"]').eq(1).should('not.be.checked')
        cy.get('input[type="radio"]').eq(2).should('not.be.checked')
        cy.get('input[type="radio"]').eq(3).should('not.be.checked')

        cy.get('input[type="radio"]').eq(0).check().should('be.checked')
        cy.get('input[type="radio"]').eq(1).check().should('be.checked')
        cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    })

    it('Country dropdown is correct', () => {
        cy.get('#country').find('option').should('have.length', 4)

        cy.get('#country').find('option').eq(0).should('have.text', '')
        cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
        cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
        cy.get('#country').find('option').eq(3).should('have.text', 'Austria')

        cy.get('#country').find('option')
        cy.get('#country').select('object:4')
        cy.get('#city').find('option')
        cy.get('#city').select('string:Tallinn')
    })

    it('Verify that city is removed when country is updated', () => {
        cy.get('#country').select('Estonia')
        cy.get('#country option').eq(2).should('be.selected')
        
        cy.get('#city').select(1)
        cy.get('#city').find('option[value="string:Tallinn"]').should('be.selected')
    
        cy.get('#country').select('Spain')
        cy.get('#country').find('option[label="Spain"]').should('be.selected')
    
        cy.get('#city').find('option[value="string:Tallinn"]').should('not.exist')
        cy.get('#city').children().should('not.be.selected')
    })

    it('Checkboxes, their content and links', () => {
        cy.get('input[type="checkbox"]').should('have.length', 2)
        cy.get('input[type="checkbox"]').parent().should('contain', 'Accept our privacy policy')
        cy.get('input[type="checkbox"]').parent().get('a[href]').should('contain', 'Accept our cookie policy')

        cy.get('button').children().eq(0).should('be.visible')
            .and('have.attr', 'href', 'cookiePolicy.html')
            .click()
        cy.url().should('contain', '/cookiePolicy.html')

        cy.go('back')
        cy.url().should('contain', '/registration_form_3.html')
        cy.log('Back again in registration form 3')

        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')
    })

    it('email filed should accept only correct email format', () => {
        cy.get('[name="email"]').type('test')
        cy.get('#emailAlert').should('be.visible').and('contain', 'Invalid email address')

        cy.get('[name="email"]').clear()
        cy.get('[name="email"]').type('test@gmail.com')
        cy.get('#emailAlert').should('not.be.visible')
    })

})


/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */
describe('Section 2: Functional tests for registration form 3', () => {

    it('All fields are filled in + corresponding assertions', ()=>{
        cy.get('#name').type('Tony Test')
        cy.get('input[name="email"]').type('test@test.ee')
        cy.get('#country').find('option')
        cy.get('#country').select('object:4')
        cy.get('#city').find('option')
        cy.get('#city').select('string:Tallinn')

        cy.get('input[type="date"]').then($input => {
            const date = '2024-05-10'; 
            $input.val(date).trigger('change');
        })

        cy.get('input[type="radio"]').eq(2).check().should('be.checked')

        cy.get('#birthday').then($input => {
            const date = '1993-04-14';
            $input.val(date).trigger('change');
        })

        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')

        cy.window().then(window => {
            window.postYourAdd()
        })

        cy.get('#successFrame').should('exist').invoke('text').as('successMessage')
        cy.get('@successMessage').should('contain', 'Successful registration')
    })

    it('Only mandatory fields are filled in + corresponding assertions', () => {
        cy.get('#name').type('Tony Test')
        cy.get('[name="email"]').type('test@gmail.com')
        cy.get('#emailAlert').should('not.be.visible')
        cy.get('#country').find('option')
        cy.get('#country').select('object:4')
        cy.get('#city').find('option')
        cy.get('#city').select('string:Tallinn')

        cy.get('input[type="checkbox"]').eq(0).check().should('be.checked')
        cy.get('input[type="checkbox"]').eq(1).check().should('be.checked')

        cy.get('input[type="submit"]').should('be.enabled')

    })

    it('Mandatory fields are absent + corresponding assertions (try using function)', () => {
        cy.get('#name').type(' ')
        cy.get('[name="email"]').type('test')
        cy.get('#emailAlert').should('be.visible').and('contain', 'Invalid email address')
        cy.get('#country').select(0)

        cy.get('input[type="submit"]').should('not.be.enabled')
    })

    it('Add file functionlity', () => {
        cy.get('input[type=file]').selectFile('load_this_file_reg_form_3.txt')

        cy.get('button[type="submit"]').should('be.enabled').and('contain', 'Submit file').click()
        
        cy.url().should('contain', '/upload_file.html')
        cy.get('h1').should('have.text', 'Submission received')
    })

    
})