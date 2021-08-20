// @flow

import { FieldTextStateless } from '@atlaskit/field-text';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Dialog } from '../../../base/dialog';
import { Icon, IconAdd, IconClose, IconSmallDragHandle } from '../../../base/icons';
import Tooltip from "@atlaskit/tooltip";
import AbstractPollCreateDialog from '../AbstractPollCreateDialog';
import type { AbstractProps } from '../AbstractPollCreateDialog';

/**
 * A modal component to answer polls.
 *
 * @param {AbstractProps} props - The passed props.
 * @returns {React.Node}
 */
const PollCreateDialog = (props: AbstractProps) => {
    const {
        question, setQuestion,
        answers, setAnswer, addAnswer, moveAnswer, removeAnswer,
        onSubmit,
        t
    } = props;

    /*
     * This ref stores the Array of answer input fields, allowing us to focus on them.
     * This array is maintained by registerfieldRef and the useEffect below.
     */
    const answerInputs = useRef([]);
    const registerFieldRef = useCallback((i, r) => {
        if (r === null) {
            return;
        }
        answerInputs.current[i] = r.input;
    }, [ answerInputs ]);

    useEffect(() => {
        answerInputs.current = answerInputs.current.slice(0, answers.length);
    }, [ answers ]);

    /*
     * This state allows us to requestFocus asynchronously, without having to worry
     * about whether a newly created input field has been rendered yet or not.
     */
    const [ lastFocus, requestFocus ] = useState(null);

    useEffect(() => {
        if (lastFocus === null) {
            return;
        }
        const input = answerInputs.current[lastFocus];

        if (input === undefined) {
            return;
        }
        input.focus();
    }, [ lastFocus ]);

    const onQuestionKeyDown = useCallback(ev => {
        if (ev.key === 'Enter') {
            requestFocus(0);
            ev.preventDefault();
        }
    });

    // Called on keypress in answer fields
    const onAnswerKeyDown = useCallback((i, ev) => {
        if (ev.ctrlKey || ev.metaKey) {
            return;
        }
        if (ev.key === 'Enter') {
            addAnswer(i + 1);
            requestFocus(i + 1);
            ev.preventDefault();
        } else if (ev.key === 'Backspace' && ev.target.value === '' && answers.length > 1) {
            removeAnswer(i);
            requestFocus(i > 0 ? i - 1 : 0);
            ev.preventDefault();
        } else if (ev.key === 'ArrowDown' || (ev.key === 'Tab' && !ev.shiftKey)) {
            if (i === answers.length - 1) {
                addAnswer();
            }
            requestFocus(i + 1);
            ev.preventDefault();
        } else if (ev.key === 'ArrowUp' || (ev.key === 'Tab' && ev.shiftKey)) {
            if (i === 0) {
                addAnswer(0);
                requestFocus(0);
            } else {
                requestFocus(i - 1);
            }
            ev.preventDefault();
        }
    }, [ answers, addAnswer, removeAnswer, requestFocus ]);

    const [ grabbing, setGrabbing ] = useState(null);

    const onGrab = useCallback((i, ev) => {
        if (ev.button !== 0) {
            return;
        }
        setGrabbing(i);
        window.addEventListener('mouseup', () => {
            setGrabbing(_grabbing => {
                requestFocus(_grabbing);

                return null;
            });
        }, { once: true });
    });
    const onMouseOver = useCallback(i => {
        if (grabbing !== null && grabbing !== i) {
            moveAnswer(grabbing, i);
            setGrabbing(i);
        }
    });

    /* eslint-disable react/jsx-no-bind */
    return (<Dialog
        okKey = { 'polls.create.send' }
        onSubmit = { onSubmit }
        titleKey = 'polls.create.dialogTitle'
        width = 'small'>
        <div className = 'poll-question-field'>
            <FieldTextStateless
                autoFocus = { true }
                compact = { true }
                isLabelHidden = { true }
                onChange = { ev => setQuestion(ev.target.value) }
                onKeyDown = { onQuestionKeyDown }
                placeholder = { t('polls.create.questionPlaceholder') }
                shouldFitContainer = { true }
                type = 'text'
                value = { question } />
        </div>
        <ul className = 'poll-answer-field-list' >
            {answers.map((answer, i) =>
                (<li
                    className = { `poll-answer-field${grabbing === i ? ' poll-dragged' : ''}` }
                    key = { i }
                    onMouseOver = { () => onMouseOver(i) }>
                    <button
                        className = 'poll-drag-handle'
                        onMouseDown = { ev => onGrab(i, ev) }
                        tabIndex = '-1'
                        type = 'button'>
                        <Icon src = { IconSmallDragHandle } />
                    </button>
                    <FieldTextStateless
                        compact = { true }
                        isLabelHidden = { true }
                        onChange = { ev => setAnswer(i, ev.target.value) }
                        onKeyDown = { ev => onAnswerKeyDown(i, ev) }
                        placeholder = { t('polls.create.answerPlaceholder', { index: i + 1 }) }
                        ref = { r => registerFieldRef(i, r) }
                        shouldFitContainer = { true }
                        type = 'text'
                        value = { answer } />
                    <Tooltip content = { t('polls.create.removeAnswer') }>
                        <button
                            className = 'poll-icon-button'
                            onClick = { () => removeAnswer(i) }
                            type = 'button'>
                            <Icon src = { IconClose } />
                        </button>
                    </Tooltip>
                </li>)
            )}
        </ul>
        <div className = 'poll-add-button'>
            <Tooltip content = { t('polls.create.addAnswer') }>
                <button
                    className = 'poll-icon-button'
                    onClick = { () => addAnswer() }
                    type = 'button'>
                    <Icon src = { IconAdd } />
                </button>
            </Tooltip>
        </div>
    </Dialog>);
};

/*
 * We apply AbstractPollCreateDialog to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
export default AbstractPollCreateDialog(PollCreateDialog);