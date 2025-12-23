'use client';

import { useEffect, useState } from 'react';
import Link from '../../atoms/Link';
import { trackClick } from '../../../utils/click-tracker';

export default function MobileStickyCTA() {
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if already dismissed (session-based)
        const isDismissed = sessionStorage.getItem('stickyCTA_dismissed');
        if (isDismissed) {
            setDismissed(true);
            return;
        }

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const pageHeight = document.documentElement.scrollHeight - window.innerHeight;

            const scrollPercent = (scrollPosition / pageHeight) * 100;

            if (scrollPercent >= 25) {
                setVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const dismissCTA = () => {
        sessionStorage.setItem('stickyCTA_dismissed', 'true');
        setVisible(false);

        // Remove from DOM after animation finishes
        setTimeout(() => setDismissed(true), 300);
    };

    if (dismissed) return null;

    return (
        <div id="mobile-sticky-cta" className={`mobile-sticky-cta ${visible ? 'show' : ''}`}>
            <Link
                openInNewTab="false"
                href="/contact-us"
                id="mobile-sticky-cta-button"
                type="button"
                className="cta-button sb-component sb-component-block sb-component-button sb-component-button-primary text-xs lg:whitespace-nowrap"
                onClick={(event: any) => {
                    dismissCTA();
                    trackClick(event);
                }}
            >
                Questions? Talk to Us — Free 45-Minute Call
            </Link>

            <button className="cta-close" aria-label="Dismiss" onClick={dismissCTA}>
                ✕
            </button>
        </div>
    );
}
