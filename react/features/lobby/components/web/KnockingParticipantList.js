// @flow

import React from 'react';

import { translate } from '../../../base/i18n';
import { connect } from '../../../base/redux';
import { isToolboxVisible } from "../../../toolbox/functions.web";
import { HIDDEN_EMAILS } from "../../constants";
import NotificationWithParticipants from '../../../notifications/components/web/NotificationWithParticipants';
import { approveKnockingParticipant, rejectKnockingParticipant } from '../../actions';
import AbstractKnockingParticipantList, {
    mapStateToProps as abstractMapStateToProps,
    type Props as AbstractProps
} from '../AbstractKnockingParticipantList';

import infoConf from "../../../../../infoConference";

type Props = AbstractProps & {

    /**
     * True if the toolbox is visible, so we need to adjust the position.
     */
    _toolboxVisible: boolean
};

/**
 * Component to render a list for the actively knocking participants.
 */
class KnockingParticipantList extends AbstractKnockingParticipantList<Props> {
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */
    render() {
        // const { _participants, _visible, t } = this.props;
        const { _participants, _toolboxVisible, _visible, t } = this.props;

        if (!_visible) {
            return null;
        }

        return (
            <div 
                // className = { _toolboxVisible ? "toolbox-visible" : "" }
                id = 'knocking-participant-list'
            >
                <div className = 'title'>
                    { t('lobby.knockingParticipantList') }
                </div>
                {/* <NotificationWithParticipants
                    approveButtonText = { t('lobby.allow') }
                    onApprove = { approveKnockingParticipant }
                    onReject = { rejectKnockingParticipant }
                    participants = { _participants }
                    rejectButtonText = { t('lobby.reject') }
                    testIdPrefix = 'lobby' /> */}
                <ul className = 'knocking-participants-container'>
                    { _participants.map(p => (
                        <li
                            className = 'knocking-participant'
                            key = { p.id }>
                            <Avatar
                                displayName = { p.name }
                                size = { 48 }
                                testId = { `${testIdPrefix}.avatar` }
                                url = { p.loadableAvatarUrl } />

                            <div className = 'details'>
                                <span data-testid = { `${testIdPrefix}.name` }>
                                    { p.name }
                                </span>
                                { p.email && !HIDDEN_EMAILS.includes(p.email) && (
                                    <span data-testid = { `${testIdPrefix}.email` }>
                                        { p.email }
                                    </span>
                                ) }
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
                        </li>
                    )) }
                </ul>
            </div>
        );
    }
}

export default translate(connect(abstractMapStateToProps)(KnockingParticipantList));
