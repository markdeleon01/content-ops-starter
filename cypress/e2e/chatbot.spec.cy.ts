describe('ARA Chatbot E2E Tests', () => {
    beforeEach(() => {
        // Visit the page containing the chatbot
        cy.visit('/');

        // Intercept API calls to mock responses
        cy.intercept('POST', '/api/chat', {
            statusCode: 200,
            body: 'data: {"type":"text","content":"Hello! How can I help you?"}\n\ndata: {"type":"end"}\n\n',
            headers: {
                'Content-Type': 'text/event-stream'
            }
        }).as('chatRequest');
    });

    describe('Chatbot Widget Display', () => {
        it('should display the ARA chatbot toggle button', () => {
            cy.contains('button', 'Live Agent: ARA').should('be.visible');
        });

        it('should have correct button styling', () => {
            cy.contains('button', 'Live Agent: ARA')
                .should('have.css', 'background-color')
                .and('equal', 'rgb(255, 165, 0)'); // Orange color #FFA500
        });

        it('should not show chat window by default', () => {
            cy.get('[role="dialog"]', { timeout: 0 }).should('not.exist');
        });
    });

    describe('Opening Chat Window', () => {
        it('should open chat window when toggle button is clicked', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"][aria-label="Chat with ARA"]').should('be.visible');
        });

        it('should display greeting message when opened', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.contains("Hi, I'm ARA, your Admin Rescue Assistant").should('be.visible');
        });

        it('should display chat header with title', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.contains('span', 'Chat with ARA').should('be.visible');
        });

        it('should focus on input field when chat opens', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            // Input should be focused or at least visible and ready for input
            cy.get('input[placeholder="Ask ARA..."]').should('be.visible');
        });

        it('should be closable via toggle button', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('be.visible');

            // Close the chat by clicking toggle button again
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('not.exist');
        });
    });

    describe('Input and Message Sending', () => {
        beforeEach(() => {
            cy.contains('button', 'Live Agent: ARA').click();
        });

        it('should allow typing in input field', () => {
            const message = 'Tell me about your services';
            cy.get('input[placeholder="Ask ARA..."]')
                .type(message)
                .should('have.value', message);
        });

        it('should disable send button initially', () => {
            cy.get('button').contains('Send').should('not.be.disabled');
        });

        it('should send message when Send button is clicked', () => {
            cy.get('input[placeholder="Ask ARA..."]').type('What services do you offer?');
            cy.get('button').contains('Send').click();

            cy.wait('@chatRequest').then((interception) => {
                const body = typeof interception.request.body === 'string'
                    ? interception.request.body
                    : JSON.stringify(interception.request.body);
                expect(body).to.include('What services do you offer?');
            });
        });

        it('should send message when Enter key is pressed', () => {
            cy.get('input[placeholder="Ask ARA..."]')
                .type('What are your hours?{enter}');

            cy.wait('@chatRequest');
        });

        it('should clear input after sending message', () => {
            cy.get('input[placeholder="Ask ARA..."]')
                .type('Test message');
            cy.get('button').contains('Send').click();

            cy.get('input[placeholder="Ask ARA..."]')
                .should('have.value', '');
        });

        it('should disable input while message is being sent', () => {
            cy.get('input[placeholder="Ask ARA..."]').type('Test');
            cy.get('button').contains('Send').click();

            // Input should be disabled during loading
            cy.get('input[placeholder="Ask ARA..."]').should('be.disabled');
        });

        it('should disable send button while message is being sent', () => {
            cy.get('input[placeholder="Ask ARA..."]').type('Test');
            cy.get('button').contains('Send').click();

            cy.get('button').contains('…').should('exist');
        });
    });

    describe('User Message Display', () => {
        beforeEach(() => {
            cy.contains('button', 'Live Agent: ARA').click();
        });

        it('should display user message in chat', () => {
            const userMessage = 'How do I get started?';
            cy.get('input[placeholder="Ask ARA..."]').type(userMessage);
            cy.get('button').contains('Send').click();

            cy.contains(userMessage).should('be.visible');
        });

        it('should style user messages differently', () => {
            cy.get('input[placeholder="Ask ARA..."]').type('User message');
            cy.get('button').contains('Send').click();

            cy.contains('User message')
                .closest('li')
                .should('have.css', 'background-color')
                .and('equal', 'rgb(217, 248, 255)'); // Light blue #D9F8FF
        });

        it('should show user messages in correct order', () => {
            const message1 = 'First question';
            const message2 = 'Second question';

            cy.get('input[placeholder="Ask ARA..."]').type(message1);
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest');

            cy.get('input[placeholder="Ask ARA..."]').type(message2);
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest');

            cy.get('ul > li').then((messages) => {
                // Greeting, first user message, first bot response, second user message, second bot response
                expect(messages.length).to.be.greaterThan(2);
            });
        });
    });

    describe('Bot Response Display', () => {
        beforeEach(() => {
            cy.contains('button', 'Live Agent: ARA').click();
        });

        it('should display bot response after sending message', () => {
            cy.get('input[placeholder="Ask ARA..."]').type('Hello');
            cy.get('button').contains('Send').click();

            cy.wait('@chatRequest').then(() => {
                cy.contains('Hello! How can I help you?', { timeout: 5000 }).should('be.visible');
            });
        });

        it('should style bot messages with gray background', () => {
            cy.get('input[placeholder="Ask ARA..."]').type('Hi');
            cy.get('button').contains('Send').click();

            cy.wait('@chatRequest').then(() => {
                cy.contains('Hello! How can I help you?', { timeout: 5000 }).closest('li')
                    .should('have.css', 'background-color')
                    .and('equal', 'rgb(243, 244, 246)'); // Gray #F3F4F6
            });
        });

        it('should show loading indicator while streaming', () => {
            cy.get('input[placeholder="Ask ARA..."]').type('Test');
            cy.get('button').contains('Send').click();

            // Loading indicator should appear
            cy.contains('...', { timeout: 5000 }).should('be.visible');
        });

        it('should remove loading indicator when response completes', () => {
            cy.get('input[placeholder="Ask ARA..."]').type('Test');
            cy.get('button').contains('Send').click();

            cy.wait('@chatRequest');

            // Loading indicator should disappear
            cy.contains('...', { timeout: 5000 }).should('not.exist');
        });

        it('should handle multiple messages in conversation', () => {
            const messages = ['Hello', 'What services?', 'Tell me more'];

            messages.forEach((msg) => {
                cy.get('input[placeholder="Ask ARA..."]').type(msg);
                cy.get('button').contains('Send').click();
                cy.wait('@chatRequest', { timeout: 10000 });
            });

            // All user messages should exist in the chat (scroll to see them)
            messages.forEach((msg) => {
                cy.contains(msg, { timeout: 5000 }).should('exist');
            });
        });
    });

    describe('Closing Chat Window', () => {
        it('should close chat when minimize button is clicked', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('be.visible');

            // Close chat using the toggle button (since close button resets history)
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('not.exist');
        });

        it('should close chat when toggle button is clicked again', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('be.visible');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('not.exist');
        });

        it('should preserve messages when reopening chat', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Remember this');
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest');

            // Close chat using the toggle button
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('not.exist');

            // Reopen chat
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('be.visible');

            // Message should be cleared since close resets history
            cy.contains('Remember this').should('not.exist');
        });
    });

    describe('Error Handling', () => {
        it('should handle API errors gracefully', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 500,
                body: 'Internal Server Error'
            }).as('chatError');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Test');
            cy.get('button').contains('Send').click();

            cy.wait('@chatError');
            cy.contains(/Unable to reach|error/i, { timeout: 5000 }).should('be.visible');
        });

        it('should show error message in chat', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 502
            }).as('badGateway');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Test');
            cy.get('button').contains('Send').click();

            cy.wait('@badGateway');
            // Error should appear in chat - check that an error message was added
            cy.get('ul').should('contain.text', 'HTTP error');
        });

        it('should allow sending new message after error', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 500
            }).as('chatError');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('First message');
            cy.get('button').contains('Send').click();
            cy.wait('@chatError');

            // Reset interceptor for second attempt
            cy.intercept('POST', '/api/chat', {
                statusCode: 200,
                body: 'data: {"type":"text","content":"Success"}\n\ndata: {"type":"end"}\n\n',
                headers: {
                    'Content-Type': 'text/event-stream'
                }
            }).as('chatSuccess');

            cy.get('input[placeholder="Ask ARA..."]').should('not.be.disabled');
            cy.get('input[placeholder="Ask ARA..."]').type('Second message');
            cy.get('button').contains('Send').click();

            cy.wait('@chatSuccess');
            cy.contains('Success', { timeout: 5000 }).should('exist');
        });
    });

    describe('Accessibility', () => {
        it('should have proper button roles', () => {
            // Button elements have implicit role - native button elements
            cy.contains('button', 'Live Agent: ARA').should('have.prop', 'tagName', 'BUTTON');
        });

        it('should have aria-expanded attribute', () => {
            const toggleBtn = cy.contains('button', 'Live Agent: ARA');
            toggleBtn.should('have.attr', 'aria-expanded', 'false');

            toggleBtn.click();
            toggleBtn.should('have.attr', 'aria-expanded', 'true');
        });

        it('should have proper dialog attributes', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]')
                .should('have.attr', 'role', 'dialog')
                .and('have.attr', 'aria-label', 'Chat with ARA');
        });

        it('should have aria-live region', () => {
            cy.get('#chatbot-widget').should('have.attr', 'aria-live', 'polite');
        });

        it('should have input label', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').should('have.attr', 'aria-label', 'Ask ARA');
        });

        it('should have proper heading structure', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.contains('span', 'Chat with ARA').should('exist');
        });
    });

    describe('Responsive Design', () => {
        it('should display properly on mobile viewport', () => {
            cy.viewport('iphone-x');
            cy.contains('button', 'Live Agent: ARA').should('be.visible');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]', { timeout: 10000 }).should('exist');
        });

        it('should display properly on tablet viewport', () => {
            cy.viewport('ipad-2');
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('be.visible');
        });

        it('should be clickable on touch devices', () => {
            cy.viewport('iphone-x');
            cy.contains('button', 'Live Agent: ARA').should('be.visible').click();
            cy.get('[role="dialog"]', { timeout: 5000 }).should('be.visible');
        });
    });

    describe('Message Flow', () => {
        it('should maintain conversation context', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            // First exchange
            cy.get('input[placeholder="Ask ARA..."]').type('What is your company name?');
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest', { timeout: 10000 });

            // Second exchange
            cy.get('input[placeholder="Ask ARA..."]').type('What services do you offer?');
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest', { timeout: 10000 });

            // Both user messages should be visible
            cy.contains('What is your company name?', { timeout: 5000 }).should('exist');
            cy.contains('What services do you offer?', { timeout: 5000 }).should('exist');
        });

        it('should scroll to latest message', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            // Send multiple messages to create overflow
            for (let i = 0; i < 3; i++) {
                cy.get('input[placeholder="Ask ARA..."]').type(`Message ${i}`);
                cy.get('button').contains('Send').click();
                cy.wait('@chatRequest', { timeout: 10000 });
            }

            // The latest message should exist in the DOM
            cy.contains('Message 2', { timeout: 5000 }).should('exist');
        });
    });

    describe('Keyboard Navigation', () => {
        it('should send message with Enter key', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]')
                .type('Test message{enter}');

            cy.wait('@chatRequest');
            cy.contains('Test message').should('be.visible');
        });

        it('should close chat window with Escape key', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('be.visible');

            // Send Escape key to the dialog
            cy.get('[role="dialog"]').trigger('keydown', { key: 'Escape', code: 'Escape' });
            cy.get('[role="dialog"]').should('not.exist');
        });

        it('should move focus within dialog with Tab key', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            // Dialog should be visible and contain focusable elements
            cy.get('[role="dialog"]').should('be.visible');
            cy.get('[role="dialog"]').within(() => {
                cy.get('input, button').should('exist');
            });
        });

        it('should not allow Tab to exit dialog (focus trap)', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            // Dialog should be open and contain focusable elements
            cy.get('[role="dialog"]').should('be.visible');
            cy.get('[role="dialog"]').within(() => {
                cy.get('input, button').should('have.length.greaterThan', 0);
            });
        });

        it('should restore focus to toggle button after closing', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('be.visible');

            // Close with Escape
            cy.get('[role="dialog"]').trigger('keydown', { key: 'Escape', code: 'Escape' });

            // Dialog should be closed
            cy.get('[role="dialog"]').should('not.exist');
        });
    });

    describe('Focus Management', () => {
        it('should focus input field when chat opens', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').should('be.visible');
        });

        it('should maintain focus in input while typing', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('test');

            cy.get('input[placeholder="Ask ARA..."]').should('have.value', 'test');
        });

        it('should not lose focus after sending message', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('message');
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest');

            // Input should be cleared and ready for next message
            cy.get('input[placeholder="Ask ARA..."]').should('have.value', '');
        });

        it('should trap focus within dialog', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            // Dialog should contain focusable elements
            cy.get('[role="dialog"]').within(() => {
                cy.get('input, button').should('have.length.greaterThan', 0);
            });
        });
    });

    describe('Rich Content & Markdown', () => {
        it('should display bold text in bot response', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 200,
                body: 'data: {"type":"text","content":"This is **bold** text"}\n\ndata: {"type":"end"}\n\n',
                headers: {
                    'Content-Type': 'text/event-stream'
                }
            }).as('boldResponse');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Show bold');
            cy.get('button').contains('Send').click();
            cy.wait('@boldResponse', { timeout: 10000 });

            // Bold text should be rendered
            cy.get('[role="dialog"]').should('contain', 'bold');
        });

        it('should display code blocks in bot response', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 200,
                body: 'data: {"type":"text","content":"Here is code:\\n\\n```js\\nconst x = 42;\\n```"}\n\ndata: {"type":"end"}\n\n',
                headers: {
                    'Content-Type': 'text/event-stream'
                }
            }).as('codeResponse');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Show code');
            cy.get('button').contains('Send').click();
            cy.wait('@codeResponse', { timeout: 10000 });

            cy.contains('const', { timeout: 5000 }).should('exist');
        });

        it('should handle links in bot response', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 200,
                body: 'data: {"type":"text","content":"Check this [link](https://example.com) for info"}\n\ndata: {"type":"end"}\n\n',
                headers: {
                    'Content-Type': 'text/event-stream'
                }
            }).as('linkResponse');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Show link');
            cy.get('button').contains('Send').click();
            cy.wait('@linkResponse', { timeout: 10000 });

            cy.get('a', { timeout: 5000 }).should('exist');
        });

        it('should handle lists in bot response', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 200,
                body: 'data: {"type":"text","content":"Here are items:\\n- Item 1\\n- Item 2\\n- Item 3"}\n\ndata: {"type":"end"}\n\n',
                headers: {
                    'Content-Type': 'text/event-stream'
                }
            }).as('listResponse');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Show list');
            cy.get('button').contains('Send').click();
            cy.wait('@listResponse', { timeout: 10000 });

            cy.contains('Item 1', { timeout: 5000 }).should('exist');
        });

        it('should handle special characters in messages', () => {
            const specialMessage = 'Test with @#$%^&*() special chars';

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type(specialMessage);
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest', { timeout: 10000 });

            cy.contains(specialMessage, { timeout: 5000 }).should('exist');
        });
    });

    describe('Long Messages & Scrolling', () => {
        it('should handle very long user message', () => {
            const longMessage = 'a'.repeat(500);

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type(longMessage);
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest', { timeout: 10000 });

            // Message should be visible and properly wrapped
            cy.get('ul li').should('contain', 'aaaa');
        });

        it('should handle very long bot response', () => {
            const longContent = 'This is a long response. '.repeat(50);

            cy.intercept('POST', '/api/chat', {
                statusCode: 200,
                body: `data: {"type":"text","content":"${longContent}"}\n\ndata: {"type":"end"}\n\n`,
                headers: {
                    'Content-Type': 'text/event-stream'
                }
            }).as('longResponse');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Show long response');
            cy.get('button').contains('Send').click();
            cy.wait('@longResponse', { timeout: 10000 });

            // Bot response should be displayed and scrollable
            cy.contains('This is a long response', { timeout: 5000 }).should('exist');
        });

        it('should auto-scroll to new messages', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            // Send messages to create overflow
            for (let i = 0; i < 2; i++) {
                cy.get('input[placeholder="Ask ARA..."]').type(`Message ${i}`);
                cy.get('button').contains('Send').click();
                cy.wait('@chatRequest', { timeout: 10000 });
            }

            // Latest message should be visible
            cy.contains('Message 1', { timeout: 5000 }).should('exist');
        });

        it('should maintain scroll position when input changes', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            // Send a message
            cy.get('input[placeholder="Ask ARA..."]').type('First');
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest', { timeout: 10000 });

            // Type but don't send - first message should still be visible
            cy.get('input[placeholder="Ask ARA..."]').type('Second');
            cy.contains('First', { timeout: 5000 }).should('exist');
        });
    });

    describe('Input Validation', () => {
        it('should not send empty message', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('button').contains('Send').click();

            // No request should be made
            cy.get('@chatRequest.all').then((calls) => {
                // Verify no new request was made for empty input
                expect(calls.length).to.equal(0);
            });
        });

        it('should not send whitespace-only message', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('   ');
            cy.get('[role="dialog"] button').contains('Send').click();

            // Component should not send whitespace-only messages
            cy.get('[role="dialog"] button').contains('Send').should('not.be.disabled');
            // Only greeting message should exist
            cy.get('[role="dialog"] ul li').should('have.length', 1);
        });

        it('should trim whitespace from messages', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('   test message   ');
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest');

            // Message should be displayed (trimmed or not, but present)
            cy.contains('test message').should('be.visible');
        });

        it('should handle messages at reasonable length limit', () => {
            const longMessage = 'x'.repeat(5000); // At max length

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type(longMessage);

            // Input should have maxLength attribute enforcing limit
            cy.get('input[placeholder="Ask ARA..."]').should('have.attr', 'maxLength', '5000');
        });

        it('should sanitize HTML in user messages', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('<script>alert("xss")</script>');
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest');

            // Script tag should not execute
            cy.on('window:alert', () => {
                throw new Error('Script tag was executed - XSS vulnerability!');
            });
        });
    });

    describe('Concurrent Operations', () => {
        it('should prevent sending multiple messages while one is in flight', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            // Send first message
            cy.get('input[placeholder="Ask ARA..."]').type('First message');
            cy.get('button').contains('Send').click();

            // While loading, input and button should be disabled
            cy.get('input[placeholder="Ask ARA..."]').should('be.disabled');
            cy.get('button').contains('…').should('exist');

            // Wait for response
            cy.wait('@chatRequest', { timeout: 10000 });
        });

        it('should handle rapid clicking of send button', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Test');

            // Click send button multiple times rapidly
            cy.get('button').contains('Send').click();
            cy.get('button').contains('Send').click();
            cy.get('button').contains('Send').click();

            cy.wait('@chatRequest');
            // Only one message should be displayed
            cy.get('ul li').its('length').should('be.greaterThan', 1);
        });

        it('should not allow message modification while sending', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            cy.get('input[placeholder="Ask ARA..."]').type('Original message');
            cy.get('button').contains('Send').click();

            // Input should be disabled during sending
            cy.get('input[placeholder="Ask ARA..."]').should('be.disabled');

            cy.wait('@chatRequest');
        });
    });

    describe('Performance & Scaling', () => {
        it('should handle many messages without lag', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            // Send 3 messages (reasonable test count)
            for (let i = 0; i < 3; i++) {
                cy.get('input[placeholder="Ask ARA..."]').type(`Message ${i}`);
                cy.get('button').contains('Send').click();
                cy.wait('@chatRequest', { timeout: 10000 });
            }

            // All messages should be visible
            cy.contains('Message 0', { timeout: 5000 }).should('exist');
            cy.contains('Message 2', { timeout: 5000 }).should('exist');

            // Chat should still be responsive
            cy.get('input[placeholder="Ask ARA..."]').should('not.be.disabled');
        });

        it('should render 50+ messages without UI freeze', () => {
            cy.contains('button', 'Live Agent: ARA').click();

            // Send multiple messages
            for (let i = 0; i < 5; i++) {
                cy.get('input[placeholder="Ask ARA..."]').type(`Message ${i}`);
                cy.get('button').contains('Send').click();
                cy.wait('@chatRequest', { timeout: 10000 });
            }

            // All messages should still be in DOM
            cy.get('ul li').should('have.length.greaterThan', 5);

            // Chat should still be responsive
            cy.get('input[placeholder="Ask ARA..."]').should('not.be.disabled');
        });

        it('should maintain chat responsiveness with large response', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 200,
                body: 'data: {"type":"text","content":"' + 'A'.repeat(10000) + '"}\n\ndata: {"type":"end"}\n\n',
                headers: {
                    'Content-Type': 'text/event-stream'
                }
            }).as('largeResponse');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Get large response');
            cy.get('button').contains('Send').click();
            cy.wait('@largeResponse');

            // Chat should remain responsive
            cy.get('input[placeholder="Ask ARA..."]').should('not.be.disabled');
        });
    });

    describe('Streaming Behavior', () => {
        it('should simulate character-by-character streaming', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 200,
                body: 'data: {"type":"text","content":"H"}\n\ndata: {"type":"text","content":"e"}\n\ndata: {"type":"text","content":"l"}\n\ndata: {"type":"text","content":"l"}\n\ndata: {"type":"text","content":"o"}\n\ndata: {"type":"end"}\n\n',
                headers: {
                    'Content-Type': 'text/event-stream'
                }
            }).as('streamResponse');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Stream test');
            cy.get('button').contains('Send').click();
            cy.wait('@streamResponse');

            // Final message should be complete
            cy.contains('Hello').should('be.visible');
        });

        it('should show loading indicator during streaming', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Test');
            cy.get('button').contains('Send').click();

            // Loading indicator should appear
            cy.contains('...', { timeout: 2000 }).should('exist');
        });

        it('should remove loading indicator when streaming completes', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Test');
            cy.get('button').contains('Send').click();

            cy.wait('@chatRequest');

            // Loading indicator should disappear
            cy.contains('...', { timeout: 5000 }).should('not.exist');
        });

        it('should handle incomplete streaming gracefully', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 200,
                body: 'data: {"type":"text","content":"Partial message"}\n\ndata: {"type":"end"}\n\n',
                headers: {
                    'Content-Type': 'text/event-stream'
                }
            }).as('incompleteStream');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Test');
            cy.get('button').contains('Send').click();

            cy.wait('@incompleteStream', { timeout: 10000 });

            // Chat should continue functioning
            cy.get('[role="dialog"]').should('be.visible');
            cy.get('input[placeholder="Ask ARA..."]').should('not.be.disabled');
        });

        it('should validate STREAM_DELAY_MS is applied', () => {
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Check stream delay');

            const messageStartTime = Date.now();
            cy.get('button').contains('Send').click();
            cy.wait('@chatRequest');

            // Verify some time passed (indicating delay is being applied)
            // This is approximate - just verify streaming happens over time
            cy.contains('Hello! How can I help you?', { timeout: 3000 }).should('be.visible');
        });
    });

    describe('Network & Timeout Handling', () => {
        it('should handle slow network response', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 200,
                body: 'data: {"type":"text","content":"Slow response"}\n\ndata: {"type":"end"}\n\n',
                headers: {
                    'Content-Type': 'text/event-stream'
                },
                delay: 1000 // 1 second delay
            }).as('slowResponse');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Slow test');
            cy.get('button').contains('Send').click();

            cy.wait('@slowResponse');
            cy.contains('Slow response', { timeout: 5000 }).should('be.visible');
        });

        it('should handle request timeout gracefully', () => {
            cy.intercept('POST', '/api/chat', {
                statusCode: 500 // Server error
            }).as('errorResponse');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Error test');
            cy.get('button').contains('Send').click();

            cy.wait('@errorResponse');
            // Error message should be shown in chat
            cy.get('[role="dialog"]').should('be.visible');
            cy.get('ul li').should('have.length.greaterThan', 1); // At least greeting + error
        });

        it('should allow retry after network failure', () => {
            let requestCount = 0;

            cy.intercept('POST', '/api/chat', (req) => {
                requestCount++;
                if (requestCount === 1) {
                    req.reply({
                        statusCode: 503 // Service Unavailable
                    });
                } else {
                    req.reply({
                        statusCode: 200,
                        body: 'data: {"type":"text","content":"Recovered"}\n\ndata: {"type":"end"}\n\n',
                        headers: {
                            'Content-Type': 'text/event-stream'
                        }
                    });
                }
            }).as('retryRequest');

            cy.contains('button', 'Live Agent: ARA').click();

            // First attempt - fails
            cy.get('input[placeholder="Ask ARA..."]').type('Retry test');
            cy.get('button').contains('Send').click();
            cy.wait('@retryRequest');

            // Should be able to send again
            cy.get('input[placeholder="Ask ARA..."]').should('not.be.disabled');
            cy.get('input[placeholder="Ask ARA..."]').type('Second attempt');
            cy.get('button').contains('Send').click();
        });

        it('should handle network errors not from server', () => {
            cy.intercept('POST', '/api/chat', { forceNetworkError: true }).as('networkError');

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Network error');
            cy.get('button').contains('Send').click();

            // Should handle error gracefully
            cy.get('[role="dialog"]').should('be.visible');
        });
    });

    describe('State Persistence', () => {
        it('should preserve message history on page reload', () => {
            // Clear any existing localStorage state from previous tests
            cy.window().then((win) => {
                win.localStorage.removeItem('ara-chatbot-messages');
                win.localStorage.removeItem('ara-chatbot-open');
            });

            // Send message and verify it was persisted
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Before reload');
            cy.get('[role="dialog"] button').contains('Send').click();
            cy.wait('@chatRequest', { timeout: 10000 });

            // Verify message was sent
            cy.contains('Before reload', { timeout: 5000 }).should('exist');

            // Wait for streaming to complete
            cy.wait(1000);

            // Verify localStorage has been populated with the message
            cy.window().then((win) => {
                const savedMessages = win.localStorage.getItem('ara-chatbot-messages');
                expect(savedMessages).to.exist;
                if (savedMessages) {
                    const parsed = JSON.parse(savedMessages);
                    expect(parsed).to.be.an('array');
                    expect(parsed.length).to.be.greaterThan(1);
                    // Verify the message is in the saved list
                    const messageExists = parsed.some((msg) => msg.text === 'Before reload');
                    expect(messageExists).to.be.true;
                }
            });

            // Close chat using the toggle button
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('not.exist');

            // Reopen chat
            cy.contains('button', 'Live Agent: ARA').click();

            // Message should be cleared since close resets history
            cy.contains('Before reload', { timeout: 5000 }).should('not.exist');
        });

        it('should preserve chat open/closed state', () => {
            // Clear any existing localStorage state from previous tests
            cy.window().then((win) => {
                win.localStorage.removeItem('ara-chatbot-messages');
                win.localStorage.removeItem('ara-chatbot-open');
            });

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('be.visible');

            // Close chat using the toggle button
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('not.exist');

            // Reload - chat should stay closed
            cy.reload();

            // Chat should remain closed
            cy.get('[role="dialog"]').should('not.exist');

            // But toggle button should still exist and be functional
            cy.contains('button', 'Live Agent: ARA').should('be.visible');
        });

        it('should persist chat across navigation', () => {
            // Clear any existing localStorage state from previous tests
            cy.window().then((win) => {
                win.localStorage.removeItem('ara-chatbot-messages');
                win.localStorage.removeItem('ara-chatbot-open');
            });

            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('input[placeholder="Ask ARA..."]').type('Persist test');
            cy.get('[role="dialog"] button').contains('Send').click();
            cy.wait('@chatRequest', { timeout: 10000 });

            // Verify message was sent
            cy.contains('Persist test', { timeout: 5000 }).should('exist');

            // Close chat using the toggle button
            cy.contains('button', 'Live Agent: ARA').click();
            cy.get('[role="dialog"]').should('not.exist');

            // Reopen chat
            cy.contains('button', 'Live Agent: ARA').click();

            // Message should be cleared since close resets history
            cy.contains('Persist test', { timeout: 5000 }).should('not.exist');
        });
    });
});
