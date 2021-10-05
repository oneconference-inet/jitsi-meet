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
            <div id = 'knocking-participant-list'>
                <div className = 'title'>
                    { t('lobby.knockingParticipantList') }
                </div>
                <NotificationWithParticipants
                    approveButtonText = { t('lobby.allow') }
                    onApprove = {() =>
                        this._onRespondToParticipantSocket(
                            p.id,
                            p.name,
                            true
                        )
                    }
                    onReject = {() =>
                        this._onRespondToParticipantSocket(
                            p.id,
                            p.name,
                            false
                        )
                    }
                    participants = { _participants }
                    rejectButtonText = { t('lobby.reject') }
                    testIdPrefix = 'lobby' />
            </div>
        );
    }
}

// export default translate(connect(abstractMapStateToProps)(KnockingParticipantList));

/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
 function _mapStateToProps(state: Object): $Shape<Props> {
    return {
        ...abstractMapStateToProps(state),
        _toolboxVisible: isToolboxVisible(state),
    };
}

export default translate(connect(_mapStateToProps)(KnockingParticipantList));
