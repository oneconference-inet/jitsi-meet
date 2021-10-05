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
        console.log('1111KnockingParticipantList');
        console.log('1111KnockingParticipantList11', _participants);
        console.log('1111KnockingParticipantList_visible', _visible);

        if (!_visible) {
            return null;
        }

        return (
            <div id = 'knocking-participant-list'>
                <div className = 'title'>
                    { t('lobby.knockingParticipantList') }
                </div>
                <div>123456789={ _participants.length }</div>
                <NotificationWithParticipants
                    approveButtonText = { t('lobby.allow') }
                    onApprove = { approveKnockingParticipant }
                    onReject = { rejectKnockingParticipant }
                    participants = { _participants }
                    rejectButtonText = { t('lobby.reject') }
                    testIdPrefix = 'lobby' />
            </div>
        );
    }
}

export default translate(connect(abstractMapStateToProps)(KnockingParticipantList));
