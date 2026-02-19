'use client';

import * as React from 'react';
import classNames from 'classnames';
import ChevronDown from '../svgs/chevron-down';
import Chat from '../svgs/chat';
import { renderMarkdown } from '../../utils/markdownRenderer.js';

const CHATBOT_ORANGE = '#FFA500';
const CHATBOT_USER_BUBBLE = '#D9F8FF'; // site neutral (light baby blue)
const GREETING =
    "Hi, I'm ARA, your Admin Rescue Assistant. I can help you get more information about our company SMYLSYNC and the services we offer. How can I help you?";

type Message = { id: string; text: string; fromUser: boolean };

export default function Chatbot() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [messages, setMessages] = React.useState<Message[]>([
        { id: '0', text: GREETING, fromUser: false }
    ]);
    const [inputValue, setInputValue] = React.useState('');
    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            inputRef.current?.focus();
        }
    }, [isOpen, messages]);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed || isLoading) return;

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            text: trimmed,
            fromUser: true
        };
        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsLoading(true);

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
            const data = await res.json().catch(() => ({}));
            const reply =
                res.ok && typeof data.reply === 'string'
                    ? data.reply
                    : (data.error && String(data.error)) ||
                      'Something went wrong. Please try again.';
            const botReply: Message = {
                id: `bot-${Date.now()}`,
                text: reply,
                fromUser: false
            };
            setMessages((prev) => [...prev, botReply]);
        } catch {
            const botReply: Message = {
                id: `bot-${Date.now()}`,
                text: 'Unable to reach the chat service. Please try again later.',
                fromUser: false
            };
            setMessages((prev) => [...prev, botReply]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div id="chatbot-widget" className="fixed bottom-0 right-0 z-[1100] flex flex-col items-end gap-3 p-4" aria-live="polite">
            {isOpen && (
                <div
                    className="flex w-full max-w-sm flex-col overflow-hidden rounded-lg shadow-lg sm:w-96"
                    style={{
                        border: `3px solid ${CHATBOT_ORANGE}`,
                        backgroundColor: '#ffffff'
                    }}
                    role="dialog"
                    aria-label="Chat with ARA"
                >
                    <div className="flex items-center justify-between px-4 py-3 text-white" style={{ backgroundColor: CHATBOT_ORANGE }}>
                        <span className="flex items-center font-semibold">
                            <Chat className="mr-2 h-5 w-5 shrink-0 fill-none stroke-current" />
                            Chat with ARA
                        </span>
                        <button
                            type="button"
                            onClick={handleToggle}
                            title="Minimize chat window"
                            className="rounded p-1 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Minimize chat window"
                        >
                            <ChevronDown className="h-5 w-5 fill-current" />
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
                                    <li className="mr-8 rounded-lg bg-gray-100 px-3 py-2 text-sm italic text-gray-500">
                                        <span className="animate-pulse">▌</span>(Ara is typing…)
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
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask ARA..."
                                    disabled={isLoading}
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
