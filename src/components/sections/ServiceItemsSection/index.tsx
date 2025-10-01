import * as React from 'react';
import classNames from 'classnames';

import { mapStylesToClassNames as mapStyles } from '../../../utils/map-styles-to-class-names';
import { getComponent } from '../../components-registry';
import { getDataAttrs } from '../../../utils/get-data-attrs';
import Section from '../Section';
import { Action, Badge } from '../../atoms';
import TitleBlock from '../../blocks/TitleBlock';

export default function ServiceItemsSection(props) {
    const { elementId, colors, backgroundImage, badge, title, subtitle, items = [], actions = [], variant, styles = {}, enableAnnotations } = props;
    return (
        <Section
            elementId={elementId}
            className="sb-component-featured-items-section"
            colors={colors}
            backgroundImage={backgroundImage}
            styles={styles?.self}
            {...getDataAttrs(props)}
        >
            <div className={classNames('w-full', 'flex', 'flex-col', mapStyles({ alignItems: styles?.self?.justifyContent ?? 'flex-start' }))}>
                {badge && <Badge {...badge} className="w-full max-w-sectionBody" {...(enableAnnotations && { 'data-sb-field-path': '.badge' })} />}
                {title && (
                    <TitleBlock
                        {...title}
                        className={classNames('w-full', 'max-w-sectionBody', { 'mt-4': badge?.label })}
                        {...(enableAnnotations && { 'data-sb-field-path': '.title' })}
                    />
                )}
                {subtitle && (
                    <p
                        className={classNames(
                            'w-full',
                            'max-w-sectionBody',
                            'text-lg',
                            'sm:text-2xl',
                            styles?.subtitle ? mapStyles(styles?.subtitle) : undefined,
                            {
                                'mt-4': badge?.label || title?.text
                            }
                        )}
                        {...(enableAnnotations && { 'data-sb-field-path': '.subtitle' })}
                    >
                        {subtitle}
                    </p>
                )}
                <ServiceItemVariants
                    variant={variant}
                    items={items}
                    hasTopMargin={!!(badge?.label || title?.text || subtitle)}
                    hasSectionTitle={!!title?.text}
                    hasAnnotations={enableAnnotations}
                />
                {actions.length > 0 && (
                    <div
                        className={classNames('flex', 'flex-wrap', 'items-center', 'gap-4', {
                            'mt-12': badge?.label || title?.text || subtitle || items.length > 0
                        })}
                        {...(enableAnnotations && { 'data-sb-field-path': '.actions' })}
                    >
                        {actions.map((action, index) => (
                            <Action
                                key={index}
                                {...action}
                                className="lg:whitespace-nowrap"
                                {...(enableAnnotations && { 'data-sb-field-path': `.${index}` })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}

function ServiceItemVariants(props) {
    const { variant = 'three-col-grid', ...rest } = props;
    switch (variant) {
        case 'two-col-grid':
            return <ServiceItemsTwoColGrid {...rest} />;
        case 'small-list':
            return <ServiceItemsSmallList {...rest} />;
        case 'big-list':
            return <ServiceItemsBigList {...rest} />;
        case 'toggle-list':
            return <ServiceItemsToggleList {...rest} />;
        default:
            return <ServiceItemsThreeColGrid {...rest} />;
    }
}

function ServiceItemsThreeColGrid(props) {
    const { items = [], hasTopMargin, hasSectionTitle, hasAnnotations } = props;
    if (items.length === 0) {
        return null;
    }
    const ServiceItem = getComponent('ServiceItem');
    return (
        <div
            className={classNames('w-full', 'grid', 'gap-10', 'sm:grid-cols-2', 'lg:grid-cols-3', { 'mt-12': hasTopMargin })}
            {...(hasAnnotations && { 'data-sb-field-path': '.items' })}
        >
            {items.map((item, index) => (
                <ServiceItem key={index} {...item} hasSectionTitle={hasSectionTitle} {...(hasAnnotations && { 'data-sb-field-path': `.${index}` })} />
            ))}
        </div>
    );
}

function ServiceItemsTwoColGrid(props) {
    const { items = [], hasTopMargin, hasSectionTitle, hasAnnotations } = props;
    if (items.length === 0) {
        return null;
    }
    const ServiceItem = getComponent('ServiceItem');
    return (
        <div
            className={classNames('w-full', 'grid', 'gap-10', 'sm:grid-cols-2', { 'mt-12': hasTopMargin })}
            {...(hasAnnotations && { 'data-sb-field-path': '.items' })}
        >
            {items.map((item, index) => (
                <ServiceItem key={index} {...item} hasSectionTitle={hasSectionTitle} {...(hasAnnotations && { 'data-sb-field-path': `.${index}` })} />
            ))}
        </div>
    );
}

function ServiceItemsSmallList(props) {
    const { items = [], hasTopMargin, hasSectionTitle, hasAnnotations } = props;
    if (items.length === 0) {
        return null;
    }
    const ServiceItem = getComponent('ServiceItem');
    return (
        <div
            className={classNames('w-full', 'max-w-3xl', 'grid', 'gap-10', { 'mt-12': hasTopMargin })}
            {...(hasAnnotations && { 'data-sb-field-path': '.items' })}
        >
            {items.map((item, index) => (
                <ServiceItem key={index} {...item} hasSectionTitle={hasSectionTitle} {...(hasAnnotations && { 'data-sb-field-path': `.${index}` })} />
            ))}
        </div>
    );
}

function ServiceItemsBigList(props) {
    const { items = [], hasTopMargin, hasSectionTitle, hasAnnotations } = props;
    if (items.length === 0) {
        return null;
    }
    const ServiceItem = getComponent('ServiceItem');
    return (
        <div className={classNames('w-full', 'grid', 'gap-10', { 'mt-12': hasTopMargin })} {...(hasAnnotations && { 'data-sb-field-path': '.items' })}>
            {items.map((item, index) => (
                <ServiceItem key={index} {...item} hasSectionTitle={hasSectionTitle} {...(hasAnnotations && { 'data-sb-field-path': `.${index}` })} />
            ))}
        </div>
    );
}

function ServiceItemsToggleList(props) {
    const { items = [], hasTopMargin, hasSectionTitle, hasAnnotations } = props;
    if (items.length === 0) {
        return null;
    }
    const FeaturedItemToggle = getComponent('ServiceItemToggle');
    return (
        <div
            className={classNames('w-full', 'max-w-3xl', 'grid', 'gap-6', { 'mt-12': hasTopMargin })}
            {...(hasAnnotations && { 'data-sb-field-path': '.items' })}
        >
            {items.map((item, index) => (
                <FeaturedItemToggle key={index} {...item} hasSectionTitle={hasSectionTitle} {...(hasAnnotations && { 'data-sb-field-path': `.${index}` })} />
            ))}
        </div>
    );
}
