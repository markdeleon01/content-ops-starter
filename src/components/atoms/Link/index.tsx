import * as React from 'react';
import NextLink from 'next/link';

import { trackClick } from '../../../utils/click-tracker';

export default function Link({ children, openInNewTab, href, ...other }) {

    // Pass Any internal link to Next.js Link, for anything else, use <a> tag
    const internal = /^\/(?!\/)/.test(href);
    if (internal) {
        return (
            <NextLink onClick={trackClick} href={href} {...other}>
                {children}
            </NextLink>
        );
    }

    if (openInNewTab) {
        return (
            <a onClick={trackClick} href={href} target="_blank" {...other}>
                {children}
            </a>
        );
    } else {
        return (
            <a onClick={trackClick} href={href} {...other}>
                {children}
            </a>
        );
    }
}
