import * as React from 'react';
import Markdown from 'markdown-to-jsx';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { Social, Action, Link } from '../../atoms';
import ImageBlock from '../../blocks/ImageBlock';

import { trackClick } from '../../../utils/click-tracker';
import { useEffect, useState } from 'react';

export default function Footer(props) {
    const {
        colors = 'bg-light-fg-dark',
        logo,
        title,
        text,
        primaryLinks,
        secondaryLinks,
        socialLinks = [],
        legalLinks = [],
        copyrightText,
        styles = {},
        enableAnnotations
    } = props;

    const bannerStyles: { [key: string]: React.CSSProperties } = {
        overlay: {
          position: 'fixed',
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
        },
        banner: {
          position: 'relative',
          background: '#FFA500',
          padding: '20px 30px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%',
        },
        closeButton: {
          position: 'absolute',
          top: 10,
          right: 10,
          border: 'none',
          background: 'transparent',
          fontSize: '30px',
          cursor: 'pointer',
        },
        actions: {
          marginTop: '20px',
          display: 'flex',
          gap: '10px',
        },
        accept: {
          background: '#0070f3',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        },
        reject: {
          background: '#eaeaea',
          color: '#333',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        },
      };

    const [visible, setVisible] = useState(false);
    const PRIVACY_BANNER_DISMISSED = 'privacyBannerDismissed';
    const CLICK_TRACKING = 'clickTracking';

    useEffect(() => {
        const isDismissed = localStorage.getItem(PRIVACY_BANNER_DISMISSED);
        if (!isDismissed) {
          setVisible(true);
        }
    }, []);
    
    function handleCloseBanner(event) {
        event.preventDefault();
        //console.log('handleCloseBanner')
        setVisible(false);
        localStorage.setItem(PRIVACY_BANNER_DISMISSED, 'true');
    }

    function handleAcceptTracking(event) {
        event.preventDefault();
        //console.log('handleAcceptTracking')

        // You can handle "accept" logic here (e.g., enabling tracking).
        localStorage.setItem(CLICK_TRACKING, 'true');
        handleCloseBanner(event);
    }

    function handleRejectTracking(event) {
        event.preventDefault();
        //console.log('handleRejectTracking')

        // Handle "reject" logic here (e.g., disabling tracking).
        localStorage.setItem(CLICK_TRACKING, 'false');
        handleCloseBanner(event);
    }

    return (
        <footer
            className={classNames(
                'sb-component',
                'sb-component-footer',
                colors,
                styles?.self?.margin ? mapStyles({ padding: styles?.self?.margin }) : undefined,
                styles?.self?.padding ? mapStyles({ padding: styles?.self?.padding }) : 'px-4 py-28'
            )}
            {...(enableAnnotations && { 'data-sb-object-id': props?.__metadata?.id })}
        >
            <div className="mx-auto max-w-7xl">
                <div>
                    <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-10">
                        {(logo?.url || title || text) && (
                            <div className="pb-8 sm:col-span-3 lg:col-auto">
                                {(logo?.url || title) && (
                                    <Link id='footer-logo-link' onClick={trackClick} openInNewTab='false' href="/" className="flex flex-col items-start">
                                        {logo && (
                                            <ImageBlock {...logo} className="inline-block" {...(enableAnnotations && { 'data-sb-field-path': 'logo' })} />
                                        )}
                                        {title && (
                                            <div className="h4" {...(enableAnnotations && { 'data-sb-field-path': 'title' })}>
                                                {title}
                                            </div>
                                        )}
                                    </Link>
                                )}
                                {text && (
                                    <Markdown
                                        options={{ forceBlock: true, forceWrapper: true }}
                                        className={classNames('sb-markdown', 'text-sm', { 'mt-4': title || logo?.url })}
                                        {...(enableAnnotations && { 'data-sb-field-path': 'text' })}
                                    >
                                        {text}
                                    </Markdown>
                                )}
                            </div>
                        )}
                        {primaryLinks && <FooterLinksGroup {...primaryLinks} {...(enableAnnotations && { 'data-sb-field-path': 'primaryLinks' })} />}
                        {secondaryLinks && <FooterLinksGroup {...secondaryLinks} {...(enableAnnotations && { 'data-sb-field-path': 'secondaryLinks' })} />}
                        {socialLinks.length > 0 && (
                            <div className="pb-6">
                                <ul className="flex flex-wrap items-center" {...(enableAnnotations && { 'data-sb-field-path': 'socialLinks' })}>
                                    {socialLinks.map((link, index) => (
                                        <li key={index} className="text-2xl mb-2 mr-8 lg:mr-12 last:mr-0">
                                            <Social {...link} {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {(copyrightText || legalLinks.length > 0) && (
                        <div className="sb-footer-bottom border-t pt-8 mt-16 flex flex-col sm:flex-row sm:flex-wrap sm:justify-between">
                            {legalLinks.length > 0 && (
                                <ul className="flex flex-wrap mb-3" {...(enableAnnotations && { 'data-sb-field-path': 'legalLinks' })}>
                                    {legalLinks.map((link, index) => (
                                        <li key={index} className="mb-1 mr-6 last:mr-0">
                                            <Action {...link} className="text-sm" {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {copyrightText && (
                                <Markdown
                                    options={{ forceInline: true, forceWrapper: true, wrapper: 'p' }}
                                    className={classNames('sb-markdown', 'text-sm', 'mb-4', { 'sm:order-first sm:mr-12': legalLinks.length > 0 })}
                                    {...(enableAnnotations && { 'data-sb-field-path': 'copyrightText' })}
                                >
                                    {copyrightText}
                                </Markdown>
                            )}
                        </div>
                    )}
                </div>
                <div id="app-version-number">
                    <code>v1.0.9</code>
                </div> 
                { visible && (
                <div id="privacy-banner">
                    <div style={bannerStyles.overlay}>
                        <div style={bannerStyles.banner}>
                            <button id="privacy-banner-close-button" type="button" className="sb-component sb-component-block sb-component-button sb-component-button-primary lg:whitespace-nowrap" style={bannerStyles.closeButton} onClick={handleCloseBanner}>
                            &times;
                            </button>
                            <h4>We respect your privacy</h4><br />
                            <p>
                                We use session tracking technologies to operate our website, improve usability, and to support our
                                marketing efforts. To learn more about how we collect and protect your data, visit our <a href="/privacy-policy">Privacy Policy</a>.
                            </p>
                            <div style={bannerStyles.actions}>
                                <button id="privacy-banner-accept-button" type="button" className="sb-component sb-component-block sb-component-button sb-component-button-primary lg:whitespace-nowrap" onClick={handleAcceptTracking}>Accept</button>
                                <button id="privacy-banner-reject-button" type="button"  className="sb-component sb-component-block sb-component-button sb-component-button-primary lg:whitespace-nowrap" onClick={handleRejectTracking}>Reject</button>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </footer>
    );
}

function FooterLinksGroup(props) {
    const { title, links = [] } = props;
    const fieldPath = props['data-sb-field-path'];
    if (links.length === 0) {
        return null;
    }
    return (
        <div className="pb-8" data-sb-field-path={fieldPath}>
            {title && (
                <h2 className="uppercase text-base tracking-wide" {...(fieldPath && { 'data-sb-field-path': '.title' })}>
                    {title}
                </h2>
            )}
            {links.length > 0 && (
                <ul className={classNames('space-y-3', { 'mt-7': title })} {...(fieldPath && { 'data-sb-field-path': '.links' })}>
                    {links.map((link, index) => (
                        <li key={index}>
                            <Action {...link} className="text-sm" {...(fieldPath && { 'data-sb-field-path': `.${index}` })} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
