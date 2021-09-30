// @flow

import { getCurrentConference } from '../base/conference';
import { participantIsKnockingOrUpdated } from './actions';
import socketIOClient from 'socket.io-client';
import Logger from 'jitsi-meet-logger';
/**
* Selector to return lobby enable state.
*
* @param {any} state - State object.
* @returns {boolean}
*/
export function getLobbyEnabled(state: any) {
    return state['features/lobby'].lobbyEnabled;
}

/**
* Selector to return a list of knocking participants.
*
* @param {any} state - State object.
* @returns {Array<Object>}
*/
export function getKnockingParticipants(state: any) {
    return state['features/lobby'].knockingParticipants;
}

/**
 * Selector to return lobby visibility.
 *
 * @param {any} state - State object.
 * @returns {any}
 */
export function getIsLobbyVisible(state: any) {
    return state['features/lobby'].lobbyVisible;
}

export function onSocketReqJoin(meetingId, endpoint, props) {
    const { dispatch } = props
    const logger = Logger.getLogger(__filename);
    const socket = socketIOClient(endpoint)
    socket.on(meetingId+'-requestjoin' , (incoming) => {
        logger.log("Incoming-Join: ", incoming)
        dispatch(participantIsKnockingOrUpdated(incoming));
    })
}
/**
 * Selector to return array with knocking participant ids.
 *
 * @param {any} state - State object.
 * @returns {Array}
 */
export function getKnockingParticipantsById(state: any) {
    return getKnockingParticipants(state).map(participant => participant.id);
}
