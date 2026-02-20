import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chatbot from '../src/components/Chatbot/index';

// Mock the markdown renderer
vi.mock('../src/utils/markdownRenderer.js', () => ({
    renderMarkdown: (text: string) => `<p>${text}</p>`
}));

// Mock SVG components
vi.mock('../src/components/svgs/chevron-down', () => ({
    default: () => <div data-testid="chevron-icon" />
}));

vi.mock('../src/components/svgs/chat', () => ({
    default: () => <div data-testid="chat-icon" />
}));

describe('Chatbot Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
        // Clear localStorage to ensure test isolation
        localStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Rendering', () => {
        it('should render the chatbot toggle button', () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });
            expect(toggleButton).toBeInTheDocument();
        });

        it('should display greeting message when dialog opens', async () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });
            await userEvent.click(toggleButton);
            // The greeting should be in one of the list items
            const greetings = screen.getAllByText((content, element) => {
                return element?.textContent?.includes('your Admin Rescue Assistant') ?? false;
            });
            expect(greetings.length).toBeGreaterThan(0);
        });

        it('should not show chat window when closed', () => {
            render(<Chatbot />);
            const chatDialog = screen.queryByRole('dialog');
            expect(chatDialog).not.toBeInTheDocument();
        });

        it('should have correct aria-expanded attribute when closed', () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });
            expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
        });
    });

    describe('Toggle Behavior', () => {
        it('should open chat window when toggle button is clicked', async () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });

            await userEvent.click(toggleButton);

            const chatDialog = screen.getByRole('dialog');
            expect(chatDialog).toBeInTheDocument();
        });

        it('should update aria-expanded when toggled', async () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });

            expect(toggleButton).toHaveAttribute('aria-expanded', 'false');

            await userEvent.click(toggleButton);
            expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

            await userEvent.click(toggleButton);
            expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
        });

        it('should close chat window when minimize button is clicked', async () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });

            await userEvent.click(toggleButton);
            const minimizeButtons = screen.getAllByRole('button', { name: /Minimize chat window/i });
            // Click the first minimize button (the one in the header)
            await userEvent.click(minimizeButtons[0]);
            const chatDialog = screen.queryByRole('dialog');
            expect(chatDialog).not.toBeInTheDocument();
        });
    });

    describe('Message Input and Display', () => {
        beforeEach(async () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });
            await userEvent.click(toggleButton);
        });

        it('should have input field with correct placeholder', () => {
            const input = screen.getByPlaceholderText('Ask ARA...');
            expect(input).toBeInTheDocument();
        });

        it('should have send button', () => {
            const sendButton = screen.getByRole('button', { name: /Send/i });
            expect(sendButton).toBeInTheDocument();
        });

        it('should update input value when user types', async () => {
            const input = screen.getByPlaceholderText('Ask ARA...') as HTMLInputElement;

            await userEvent.type(input, 'Hello ARA');

            expect(input.value).toBe('Hello ARA');
        });

        it('should disable input and button when loading', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"Hello"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"end"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...') as HTMLInputElement;
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test message');
            await userEvent.click(sendButton);

            expect(input).toBeDisabled();
            expect(sendButton).toBeDisabled();
        });

        it('should clear input after sending message', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"Response"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"end"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...') as HTMLInputElement;
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test message');
            await userEvent.click(sendButton);

            await waitFor(() => {
                expect(input.value).toBe('');
            });
        });
    });

    describe('Message Submission', () => {
        beforeEach(async () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });
            await userEvent.click(toggleButton);
        });

        it('should not submit empty messages', async () => {
            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.click(sendButton);

            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should not submit whitespace-only messages', async () => {
            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, '   ');
            await userEvent.click(sendButton);

            expect(global.fetch).not.toHaveBeenCalled();
        });

        it('should send POST request to /api/chat', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"Test response"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"end"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test message');
            await userEvent.click(sendButton);

            await waitFor(() => {
                expect(global.fetch).toHaveBeenCalledWith(
                    '/api/chat',
                    expect.objectContaining({
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    })
                );
            });
        });

        it('should include message in request body', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"Test response"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"end"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test message');
            await userEvent.click(sendButton);

            await waitFor(() => {
                const callArgs = (global.fetch as any).mock.calls[0];
                const body = JSON.parse(callArgs[1].body);
                expect(body.message).toBe('Test message');
            });
        });
    });

    describe('User Message Display', () => {
        beforeEach(async () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });
            await userEvent.click(toggleButton);
        });

        it('should display user message after sending', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"Bot response"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"end"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Hello');
            await userEvent.click(sendButton);

            await waitFor(() => {
                expect(screen.getByText('Hello')).toBeInTheDocument();
            });
        });

        it('should style user message correctly', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"Bot response"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"end"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Hello');
            await userEvent.click(sendButton);

            await waitFor(() => {
                const userMsg = screen.getByText('Hello').closest('li');
                if (userMsg) {
                    const bgColor = window.getComputedStyle(userMsg).backgroundColor;
                    expect(userMsg).toHaveStyle({ backgroundColor: '#D9F8FF' });
                }
            });
        });
    });

    describe('Bot Response Handling', () => {
        beforeEach(async () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });
            await userEvent.click(toggleButton);
        });

        it('should display loading indicator while streaming', async () => {
            const mockResponse = new ReadableStream({
                async start(controller) {
                    await new Promise((resolve) => setTimeout(resolve, 100));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"Response"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"end"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test');
            await userEvent.click(sendButton);

            expect(screen.getByText(/ARA is typing/i)).toBeInTheDocument();
        });

        it('should remove loading indicator when streaming completes', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"Response"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"end"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test');
            await userEvent.click(sendButton);

            await waitFor(
                () => {
                    expect(screen.queryByText(/ARA is typing/i)).not.toBeInTheDocument();
                },
                { timeout: 5000 }
            );
        });

        it('should display bot response text', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"This is a bot response"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"end"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test');
            await userEvent.click(sendButton);

            await waitFor(
                () => {
                    expect(screen.getByText(/This is a bot response/i)).toBeInTheDocument();
                },
                { timeout: 5000 }
            );
        });

        it('should handle multiple chunks in streaming response', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"Hello "}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"text","content":"world"}\n\n'));
                    controller.enqueue(new TextEncoder().encode('data: {"type":"end"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Say hello');
            await userEvent.click(sendButton);

            await waitFor(
                () => {
                    expect(screen.getByText(/Hello world/i)).toBeInTheDocument();
                },
                { timeout: 5000 }
            );
        });
    });

    describe('Error Handling', () => {
        beforeEach(async () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });
            await userEvent.click(toggleButton);
        });

        it('should handle HTTP errors gracefully', async () => {
            global.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 500
            });

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test');
            await userEvent.click(sendButton);

            await waitFor(() => {
                expect(screen.getByText(/HTTP error/i)).toBeInTheDocument();
            });
        });

        it('should handle network errors gracefully', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test');
            await userEvent.click(sendButton);

            await waitFor(() => {
                expect(screen.getByText(/Unable to reach|Network error/i)).toBeInTheDocument();
            });
        });

        it('should handle error type in streaming response', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode('data: {"type":"error","content":"Error from server"}\n\n'));
                    controller.close();
                }
            });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                body: mockResponse
            });

            const input = screen.getByPlaceholderText('Ask ARA...');
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test');
            await userEvent.click(sendButton);

            await waitFor(
                () => {
                    expect(screen.getByText('Error from server')).toBeInTheDocument();
                },
                { timeout: 5000 }
            );
        });

        it('should re-enable input after error', async () => {
            global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

            const input = screen.getByPlaceholderText('Ask ARA...') as HTMLInputElement;
            const sendButton = screen.getByRole('button', { name: /Send/i });

            await userEvent.type(input, 'Test');
            await userEvent.click(sendButton);

            await waitFor(() => {
                expect(input).not.toBeDisabled();
                expect(sendButton).not.toBeDisabled();
            });
        });
    });

    describe('Accessibility', () => {
        it('should have proper ARIA labels', async () => {
            render(<Chatbot />);

            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });
            expect(toggleButton).toHaveAttribute('aria-expanded');

            await userEvent.click(toggleButton);

            const chatDialog = screen.getByRole('dialog');
            expect(chatDialog).toHaveAttribute('aria-label', 'Chat with ARA');
        });

        it('should have proper ARIA live region', () => {
            render(<Chatbot />);
            const container = document.querySelector('#chatbot-widget');
            expect(container).toHaveAttribute('aria-live', 'polite');
        });

        it('should focus input when chat opens', async () => {
            render(<Chatbot />);
            const toggleButton = screen.getByRole('button', { name: /Open chat window with Live Agent ARA/i });

            await userEvent.click(toggleButton);

            const input = screen.getByPlaceholderText('Ask ARA...');
            await waitFor(() => {
                expect(input).toHaveFocus();
            });
        });
    });
});
