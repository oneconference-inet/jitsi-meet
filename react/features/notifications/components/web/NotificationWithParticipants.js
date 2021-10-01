// @flow

import React from 'react';

import { Avatar } from '../../../base/avatar';
import { HIDDEN_EMAILS } from '../../../lobby/constants';

import NotificationButton from './NotificationButton';

import infoConf from "../../../../../infoConference";

type Props = {

    /**
     * Text used for button which triggeres `onApprove` action.
     */
    approveButtonText: string,

    /**
     * Callback used when clicking the ok/approve button.
     */
    onApprove: Function,

    /**
     * Callback used when clicking the reject button.
     */
    onReject: Function,

    /**
     * Array of participants to be displayed.
     */
    participants: Array<Object>,

    /**
     * Text for button which triggeres the `reject` action.
     */
    rejectButtonText: string,


    /**
     * String prefix used for button `test-id`.
     */
     testIdPrefix: string
}

/**
 * Component used to display a list of notifications based on a list of participants.
 * This is visible only to moderators.
 *
 * @returns {React$Element<'div'> | null}
 */
export default function({
    approveButtonText,
    onApprove,
    onReject,
    participants,
    testIdPrefix,
    rejectButtonText
}: Props): React$Element<'ul'> {
    return (
        // 6293
        // <ul className = 'knocking-participants-container'>
        //     { participants.map(p => (
        //         <li
        //             className = 'knocking-participant'
        //             key = { p.id }>
        //             <Avatar
        //                 displayName = { p.name }
        //                 size = { 48 }
        //                 testId = { `${testIdPrefix}.avatar` }
        //                 url = { p.loadableAvatarUrl } />

        //             <div className = 'details'>
        //                 <span data-testid = { `${testIdPrefix}.name` }>
        //                     { p.name }
        //                 </span>
        //                 { p.email && !HIDDEN_EMAILS.includes(p.email) && (
        //                     <span data-testid = { `${testIdPrefix}.email` }>
        //                         { p.email }
        //                     </span>
        //                 ) }
        //             </div>
        //             { <NotificationButton
        //                 action = { onApprove }
        //                 className = 'primary'
        //                 id = 'unmute-button'
        //                 participant = { p }
        //                 testId = { `${testIdPrefix}.allow` }>
        //                 { approveButtonText }
        //             </NotificationButton> }
        //             { <NotificationButton
        //                 action = { onReject }
        //                 className = 'borderLess'
        //                 id = 'dismiss-button'
        //                 participant = { p }
        //                 testId = { `${testIdPrefix}.reject` }>
        //                 { rejectButtonText }
        //             </NotificationButton>}
        //         </li>
        //     )) }
        // </ul>

        // 5870
        <div
                className={_toolboxVisible ? "toolbox-visible" : ""}
                id="knocking-participant-list"
            >
                <span className="title">
                    {t("lobby.knockingParticipantList")}
                </span>
                <ul className="knocking-participants-container">
                    {_participants.map((p) => (
                        <li className="knocking-participant" key={p.id}>
                            {infoConf.getIsSecretRoom() ? (
                                <img src={p.image} />
                            ) : null}
                            <div style={{ display: "flex" }}>
                                <div className="details">
                                    <span data-testid="knockingParticipant.name">
                                        {p.name}
                                    </span>
                                    {p.email &&
                                        !HIDDEN_EMAILS.includes(p.email) && (
                                            <span data-testid="knockingParticipant.email">
                                                {p.email}
                                            </span>
                                        )}
                                </div>
                                <button
                                    className="primary"
                                    data-testid="lobby.allow"
                                    onClick={() =>
                                        this._onRespondToParticipantSocket(
                                            p.id,
                                            p.name,
                                            true
                                        )
                                    }
                                    type="button"
                                >
                                    {t("lobby.allow")}
                                </button>
                                <button
                                    className="borderLess"
                                    data-testid="lobby.reject"
                                    onClick={() =>
                                        this._onRespondToParticipantSocket(
                                            p.id,
                                            p.name,
                                            false
                                        )
                                    }
                                    type="button"
                                >
                                    {t("lobby.reject")}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
    );
}
