import { Popover } from 'react-tiny-popover'
import {className as compComposerClassName} from '@shared/components/Composer/create';
import {ComposerStatus} from '@shared/components/Composer/props';
import {
    statusClassName as compComposerStatusClassName,
} from '@shared/components/Composer/utils/applyNewStatusClassName';
import {isSubmitShortcutKey} from '@shared/utils/isSubmitShortcutKey';
import {ChangeEvent, KeyboardEvent, useEffect, useMemo, useRef, useState} from 'react';
import {CancelIconComp} from '../../components/CancelIcon/CancelIconComp';
import {SendIconComp} from '../../components/SendIcon/SendIconComp';
import {ComposerProps} from './props';

const submittingPromptStatuses: Array<ComposerStatus> = [
    'submitting-prompt',
    'submitting-edit',
    'submitting-conversation-starter',
    'submitting-external-message',
];

export const ComposerComp = (props: ComposerProps) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const compClassNameFromStats = compComposerStatusClassName[props.status] || '';
    const className = `${compComposerClassName} ${compClassNameFromStats}`;

    const disableTextarea = submittingPromptStatuses.includes(props.status);
    const disableButton = !props.hasValidInput || props.status === 'waiting' || submittingPromptStatuses.includes(
        props.status);
    const showSendIcon = props.status === 'typing' || props.status === 'waiting';
    const hideCancelButton = props.hideStopButton === true;
    const showCancelButton = !hideCancelButton && (submittingPromptStatuses.includes(props.status) || props.status
        === 'waiting');

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (props.status === 'typing' && props.autoFocus && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [props.status, props.autoFocus, textareaRef.current]);

    const handleChange = useMemo(() => (e: ChangeEvent<HTMLTextAreaElement>) => {
        props.onChange?.(e.target.value);
    }, [props.onChange]);

    const handleSubmit = useMemo(() => () => {
        props.onSubmit?.();
    }, [props.onSubmit]);

    const handleKeyDown = useMemo(() => (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (isSubmitShortcutKey(e, props.submitShortcut)) {
            e.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit, props.submitShortcut]);

    useEffect(() => {
        if (!textareaRef.current) {
            return;
        }
        const adjustHeight = () => {
            const textarea = textareaRef.current;
            if (textarea) {
                textarea.style.height = 'auto'; // Reset height
                textarea.style.height = `${textarea.scrollHeight}px`; // Set new height based on content
            }
        };
        textareaRef.current.addEventListener('input', adjustHeight);
        return () => {
            textareaRef.current?.removeEventListener('input', adjustHeight);
        };

    }, [textareaRef.current]);

    return (
        <div className={className}>
            {props.popoverContent && (
                <Popover
                    isOpen={isPopoverOpen}
                    onClickOutside={() => setIsPopoverOpen(false)}
                    positions={['top']}
                    content={props.popoverContent}
                >
                    <button
                        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                        tabIndex={0}
                        aria-expanded={isPopoverOpen}
                        aria-label="Open additional options"
                        className='popover-trigger'
                    >
                        <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.2842 0.85791H3.28418C2.17961 0.85791 1.28418 1.75334 1.28418 2.85791V14.8579C1.28418 15.9625 2.17961 16.8579 3.28418 16.8579H11.2842C12.3887 16.8579 13.2842 15.9625 13.2842 14.8579C14.3887 14.8579 15.2842 13.9625 15.2842 12.8579V4.85791C15.2842 3.75334 14.3887 2.85791 13.2842 2.85791C13.2842 1.75334 12.3887 0.85791 11.2842 0.85791ZM13.2842 3.85791C13.8365 3.85791 14.2842 4.30563 14.2842 4.85791V12.8579C14.2842 13.4102 13.8365 13.8579 13.2842 13.8579V3.85791ZM2.28418 2.85791C2.28418 2.30563 2.73189 1.85791 3.28418 1.85791H11.2842C11.8365 1.85791 12.2842 2.30563 12.2842 2.85791V14.8579C12.2842 15.4102 11.8365 15.8579 11.2842 15.8579H3.28418C2.7319 15.8579 2.28418 15.4102 2.28418 14.8579V2.85791Z" fill="#6C757D"/>
                        </svg>
                    </button>
                </Popover>
            )}
            <textarea
                tabIndex={0}
                ref={textareaRef}
                disabled={disableTextarea}
                placeholder={props.placeholder}
                value={props.prompt}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                aria-label={props.placeholder}
            />
            {!showCancelButton && (
                <button
                    tabIndex={0}
                    disabled={disableButton}
                    onClick={() => props.onSubmit()}
                    aria-label="Send"
                >
                    {showSendIcon && <SendIconComp/>}
                    {!showSendIcon && props.Loader}
                </button>
            )}
            {showCancelButton && (
                <button
                    tabIndex={0}
                    onClick={props.onCancel}
                    aria-label="Cancel"
                >
                    <CancelIconComp/>
                </button>
            )}
        </div>
    );
};
