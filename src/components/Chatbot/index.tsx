'use client';

import * as React from 'react';
import classNames from 'classnames';
import Close from '../svgs/close';
import Chat from '../svgs/chat';
import { renderMarkdown } from '../../utils/markdownRenderer.js';
import styles from './index.module.css';

const CHATBOT_ORANGE = '#FFA500';
const CHATBOT_USER_BUBBLE = '#D9F8FF'; // site neutral (light baby blue)
const GREETING =
    "Hi, I'm ARA, your Admin Rescue Assistant. I can help you get more information about our company SMYLSYNC and the services we offer. How can I help you?";

const STREAM_DELAY_MS = 120; // Delay in ms between each text chunk display
const MAX_MESSAGE_LENGTH = 5000;
const STORAGE_KEY = 'ara-chatbot-messages';
const STATE_KEY = 'ara-chatbot-open';

type Message = { id: string; text: string; fromUser: boolean };

export default function Chatbot() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<Message[]>([{ id: '0', text: GREETING, fromUser: false }]);
    const [inputValue, setInputValue] = React.useState('');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const dialogRef = React.useRef<HTMLDivElement>(null);
    const toggleBtnRef = React.useRef<HTMLButtonElement>(null);

    // Load persisted state on mount
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedMessages = localStorage.getItem(STORAGE_KEY);
            const savedOpen = localStorage.getItem(STATE_KEY);

            if (savedMessages) {
                try {
                    setMessages(JSON.parse(savedMessages));
                } catch (e) {
                    console.error('Failed to load persisted messages:', e);
                }
            }

            if (savedOpen === 'true') {
                setIsOpen(true);
            }
        }
    }, []);

    // Persist messages whenever they change
    React.useEffect(() => {
        if (typeof window !== 'undefined' && messages.length > 1) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    // Persist open state
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STATE_KEY, isOpen.toString());
        }
    }, [isOpen]);

    // Focus input when dialog opens or closes
    React.useEffect(() => {
        if (isOpen) {
            // Focus input when opening
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        } else if (toggleBtnRef.current) {
            // Restore focus to toggle button when closing
            setTimeout(() => {
                toggleBtnRef.current?.focus();
            }, 0);
        }
    }, [isOpen]);

    // Scroll to bottom whenever messages change (for streaming and new messages)
    React.useEffect(() => {
        if (isOpen) {
            // Use setTimeout to ensure DOM has updated before scrolling
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 0);
        }
    }, [messages, isOpen]);

    const handleToggle = () => {
        setIsOpen((prev) => {
            if (!prev) {
                // Opening the chatbot - clear messages
                setMessages([{ id: '0', text: GREETING, fromUser: false }]);
            }
            return !prev;
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();

        // Validate input
        if (!trimmed || isLoading) return;
        if (trimmed.length > MAX_MESSAGE_LENGTH) {
            alert(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`);
            return;
        }

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            text: trimmed,
            fromUser: true
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

        const botMsgId = `bot-${Date.now()}`;
        let botMsgAdded = false;

        // Helper function to delay message updates for slower streaming effect
        const delayedSetMessages = (updateFn: (prev: Message[]) => Message[]) => {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    setMessages(updateFn);
                    resolve();
                }, STREAM_DELAY_MS);
            });
        };

        const history = messages
            .filter((m) => m.id !== '0' || m.fromUser)
            .map((m) => ({ role: m.fromUser ? ('user' as const) : ('assistant' as const), content: m.text }))
            .slice(-20);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: trimmed, history })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const reader = res.body?.getReader();
            if (!reader) {
                throw new Error('Response body is not readable');
            }

            const decoder = new TextDecoder();
            let buffer = '';
            let streamEnded = false;

            const processUpdates = async () => {
                while (!streamEnded) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    // Keep the last incomplete line in buffer
                    buffer = lines[lines.length - 1];

                    for (let i = 0; i < lines.length - 1; i++) {
                        const line = lines[i].trim();
                        if (!line) continue;

                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6));
                                if (data.type === 'text') {
                                    if (!botMsgAdded) {
                                        const botReply: Message = {
                                            id: botMsgId,
                                            text: data.content,
                                            fromUser: false
                                        };
                                        await delayedSetMessages((prev) => [...prev, botReply]);
                                        botMsgAdded = true;
                                    } else {
                                        await delayedSetMessages((prev) =>
                                            prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: msg.text + data.content } : msg))
                                        );
                                    }
                                } else if (data.type === 'error') {
                                    if (!botMsgAdded) {
                                        const botReply: Message = {
                                            id: botMsgId,
                                            text: data.content,
                                            fromUser: false
                                        };
                                        await delayedSetMessages((prev) => [...prev, botReply]);
                                        botMsgAdded = true;
                                    } else {
                                        await delayedSetMessages((prev) => prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: data.content } : msg)));
                                    }
                                    streamEnded = true;
                                    break;
                                } else if (data.type === 'end') {
                                    streamEnded = true;
                                    break;
                                }
                            } catch (e) {
                                console.error('Failed to parse SSE data:', line, e);
                            }
                        }
                    }
                }

                if (buffer.trim().length > 0 && buffer.trim().startsWith('data: ')) {
                    try {
                        const data = JSON.parse(buffer.trim().slice(6));
                        if (data.type === 'text') {
                            if (!botMsgAdded) {
                                const botReply: Message = {
                                    id: botMsgId,
                                    text: data.content,
                                    fromUser: false
                                };
                                await delayedSetMessages((prev) => [...prev, botReply]);
                                botMsgAdded = true;
                            } else {
                                await delayedSetMessages((prev) => prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: msg.text + data.content } : msg)));
                            }
                        }
                    } catch (e) {
                        console.error('Failed to parse final SSE data:', e);
                    }
                }
            };

            await processUpdates();
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unable to reach the chat service. Please try again later.';
            if (!botMsgAdded) {
                const botReply: Message = {
                    id: botMsgId,
                    text: errorMsg,
                    fromUser: false
                };
                setMessages((prev) => [...prev, botReply]);
            } else {
                setMessages((prev) => prev.map((msg) => (msg.id === botMsgId ? { ...msg, text: errorMsg } : msg)));
            }
        } finally {
            setIsLoading(false);
            // Focus input field after streaming completes
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    return (
        <div id="chatbot-widget" className="fixed bottom-0 right-0 z-[1100] flex flex-col items-end gap-3 p-4" aria-live="polite">
            {isOpen && (
                <div
                    ref={dialogRef}
                    className="flex w-full max-w-sm flex-col overflow-hidden rounded-lg shadow-lg sm:w-96"
                    style={{
                        border: `3px solid ${CHATBOT_ORANGE}`,
                        backgroundColor: '#ffffff'
                    }}
                    role="dialog"
                    aria-label="Chat with ARA"
                    onKeyDown={handleKeyDown}
                >
                    <div className="flex items-center justify-between px-4 py-3 text-white" style={{ backgroundColor: CHATBOT_ORANGE }}>
                        <span className="flex items-center font-semibold">
                            <img src="/images/favicon.ico" alt="ARA" className="mr-2 h-5 w-5 shrink-0" />
                            Chat with ARA
                        </span>
                        <button
                            type="button"
                            onClick={handleToggle}
                            title="Close chat window"
                            className="rounded p-1 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Close chat window"
                        >
                            <Close className="h-5 w-5 fill-current" />
                        </button>
                    </div>

                    <div className="flex max-h-80 flex-1 flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4">
                            <ul className="space-y-3">
                                {messages.map((msg) => (
                                    <li
                                        key={msg.id}
                                        className={classNames(
                                            'rounded-lg px-3 py-2 text-sm',
                                            msg.fromUser ? 'ml-8 text-gray-900' : 'mr-8 bg-gray-100 text-gray-900'
                                        )}
                                        style={msg.fromUser ? { backgroundColor: CHATBOT_USER_BUBBLE } : undefined}
                                    >
                                        {msg.fromUser ? (
                                            msg.text
                                        ) : (
                                            <div
                                                className="prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{
                                                    __html: renderMarkdown(msg.text)
                                                }}
                                            />
                                        )}
                                    </li>
                                ))}
                                {isLoading && (
                                    <li className="mr-8 rounded-lg bg-gray-100 px-3 py-2 text-sm italic text-orange-500">
                                        <span className="animate-pulse text-orange-500">▌</span>ARA is typing
                                        <span className={styles.dot}>.</span>
                                        <span className={styles.dot}>.</span>
                                        <span className={styles.dot}>.</span>
                                    </li>
                                )}
                            </ul>
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3" style={{ backgroundColor: '#ffffff' }}>
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => {
                                        if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                                            setInputValue(e.target.value);
                                        }
                                    }}
                                    placeholder="Ask ARA..."
                                    disabled={isLoading}
                                    maxLength={MAX_MESSAGE_LENGTH}
                                    className="min-w-0 flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-[#FFA500] focus:outline-none focus:ring-1 focus:ring-[#FFA500] disabled:opacity-60"
                                    style={{ backgroundColor: '#ffffff' }}
                                    aria-label="Ask ARA"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="rounded px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60"
                                    style={{ backgroundColor: CHATBOT_ORANGE }}
                                >
                                    {isLoading ? '…' : 'Send'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <button
                ref={toggleBtnRef}
                type="button"
                onClick={handleToggle}
                className="flex items-center rounded-lg px-4 py-3 font-medium text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: CHATBOT_ORANGE }}
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Minimize chat window' : 'Open chat window with Live Agent ARA'}
            >
                <Chat className="mr-2 h-5 w-5 shrink-0 fill-none stroke-current" />
                Live Agent: ARA
            </button>
        </div>
    );
}
