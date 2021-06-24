/* @flow */

import React, { Component } from "react";

import { getConferenceName } from "../../../base/conference/functions";
import { getParticipantCount } from "../../../base/participants/functions";
import { connect } from "../../../base/redux";
import { isToolboxVisible } from "../../../toolbox/functions.web";
import ConferenceTimer from "../ConferenceTimer";

import ParticipantsCount from "./ParticipantsCount";
import Axios from "axios";
import infoConf from "../../../../../infoConference";
/**
 * The type of the React {@code Component} props of {@link Subject}.
 */
type Props = {
    /**
     * Whether the conference timer should be shown or not.
     */
    _hideConferenceTimer: Boolean,

    /**
     * Whether the participant count should be shown or not.
     */
    _showParticipantCount: boolean,

    /**
     * The subject or the of the conference.
     * Falls back to conference name.
     */
    _subject: string,

    /**
     * Indicates whether the component should be visible or not.
     */
    _visible: boolean,
};

/**
 * Subject react component.
 *
 * @class Subject
 */

declare var interfaceConfig: Object;

class Subject extends Component<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            _hideConferenceTimer,
            _showParticipantCount,
            _subject,
            _visible,
            _count,
        } = this.props;

        if (_count === 1) {
            // If participant==1 use set end-meet time API
            Axios.post(
                interfaceConfig.DOMAIN + "/api/rooms/settimelastuser",
                {
                    meetingid: infoConf.getMeetingId(),
                    time: Date.now(),
                },
                {
                    headers: {
                        Authorization:
                            "Bearer " + interfaceConfig.SECRET_KEY_ONECONF,
                    },
                }
            );
        } else if (_count === 2) {
            // If participant!=1 give reset end-meet time API
            Axios.post(
                interfaceConfig.DOMAIN + "/api/rooms/settimelastuser",
                {
                    meetingid: infoConf.getMeetingId(),
                    time: 0,
                },
                {
                    headers: {
                        Authorization:
                            "Bearer " + interfaceConfig.SECRET_KEY_ONECONF,
                    },
                }
            );
        }

        return (
            <div className={`subject ${_visible ? "visible" : ""}`}>
                <span className="subject-text">{_subject}</span>
                {_showParticipantCount && <ParticipantsCount />}
                {!_hideConferenceTimer && <ConferenceTimer />}
            </div>
        );
    }
}

/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _hideConferenceTimer: boolean,
 *     _showParticipantCount: boolean,
 *     _subject: string,
 *     _visible: boolean
 * }}
 */
function _mapStateToProps(state) {
    const participantCount = getParticipantCount(state);

    // window.onbeforeunload = function (event) {
    //     if (participantCount === 1) {
    //         Axios.post(interfaceConfig.DOMAIN + "/endmeeting", {
    //             meetingid: infoConf.getMeetingId(),
    //         });
    //     }
    // };

    return {
        _hideConferenceTimer: Boolean(
            state["features/base/config"].hideConferenceTimer
        ),
        _showParticipantCount: participantCount > 2,
        _subject: getConferenceName(state),
        _visible: isToolboxVisible(state) && participantCount > 1,
        _count: participantCount,
    };
}

export default connect(_mapStateToProps)(Subject);