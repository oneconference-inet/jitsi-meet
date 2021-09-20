// @flow

import _ from 'lodash';

import { createToolbarEvent, sendAnalytics } from '../../analytics';
import { appNavigate } from '../../app/actions';
import { disconnect } from '../../base/connection';
import { translate } from '../../base/i18n';
import { connect } from '../../base/redux';
import { AbstractHangupButton } from '../../base/toolbox/components';
import type { AbstractButtonProps } from '../../base/toolbox/components';
import { getLocalParticipant, PARTICIPANT_ROLE } from '../../base/participants';
import { EndMeetingDialog } from '../../video-menu/components';
import { openDialog } from '../../base/dialog';

import axios from 'axios';
import infoConf from '../../../../infoConference';
import infoUser from '../../../../infoUser';

declare var interfaceConfig: Object;
declare var APP: Object;

/**
 * The type of the React {@code Component} props of {@link HangupButton}.
 */
type Props = AbstractButtonProps & {
    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Component that renders a toolbar button for leaving the current conference.
 *
 * @extends AbstractHangupButton
 */
class HangupButton extends AbstractHangupButton<Props, *> {
    _hangup: Function;

    accessibilityLabel = 'toolbar.accessibilityLabel.hangup';
    label = 'toolbar.hangup';
    tooltip = 'toolbar.hangup';

    /**
     * Initializes a new HangupButton instance.
     *
     * @param {Props} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);

        this._hangup = () => {
            console.log('1111hangup1');
            console.log('1111hangup2', this.props);
            // sendAnalytics(createToolbarEvent('hangup'));
            // this._endJoin();

            // FIXME: these should be unified.
            if (navigator.product === 'ReactNative') {
                this.props.dispatch(appNavigate(undefined));
            } else {
                console.log('1111hangup3');
                console.log('1111hangup3.1', this.props);
                const { dispatch, localParticipantId, isModerator } =
                    this.props;

                if (isModerator) {
                    console.log('1111hangup4');
                    sendAnalytics(createToolbarEvent('endmeeting.pressed'));
                    dispatch(
                        openDialog(EndMeetingDialog, {
                            exclude: [localParticipantId],
                        })
                    );
                } else {
                    console.log('1111hangup5');
                    _endJoin();
                }
            }
        };
    }
    /**
     * Helper function to perform the actual hangup action.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _doHangup() {
        this._hangup();
    }
}

/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @param {Props} ownProps - The component's own props.
 * @returns {Object}
 */
function _mapStateToProps(state: Object, ownProps: Props) {
    const localParticipant = getLocalParticipant(state);
    console.log('1111localParticipant1')
    console.log('1111localParticipant2', localParticipant)
    const isModerator = localParticipant.role === PARTICIPANT_ROLE.MODERATOR;
    console.log('1111isModerator1')
    console.log('1111isModerator2', localParticipant)
    console.log('1111isModerator3', PARTICIPANT_ROLE)
    console.log('1111isModerator4', isModerator)
    // const { visible } = ownProps;
    // const { disableRemoteMute } = state['features/base/config'];

    return {
        isModerator,
        localParticipantId: localParticipant.id,
        visible: true,
    };
}

export default translate(connect(_mapStateToProps)(HangupButton));

export async function _endJoin() {
    try {
        console.log('1111endjoin1');
        const domainEnd = interfaceConfig.DOMAIN_BACK;
        const service = infoConf.getService();
        const meetingId = infoConf.getMeetingId();
        const isModerator = infoConf.getIsModerator();
        const nameJoin = infoUser.getName();
        const userId = infoUser.getUserId();
        const secretKeyManageAi = interfaceConfig.SECRET_KEY_MANAGE_AI;
        const secretKeyOnechat = interfaceConfig.SECRET_KEY_ONECHAT;
        const secretKeyOneDental = interfaceConfig.SECRET_KEY_ONE_DENTAL;
        const secretKeyOneBinar = interfaceConfig.SECRET_KEY_ONE_BINAR;
        const secretKeyJmc = interfaceConfig.SECRET_KEY_JMC;
        const secretKeyTelemedicine = interfaceConfig.SECRET_KEY_TELEMEDICINE;
        const secretKeyEmeeting = interfaceConfig.SECRET_KEY_EMEETING;
        const secretKeyEducation = interfaceConfig.SECRET_KEY_EDUCATION;
        console.log('1111endjoin2', isModerator);
        
        if (isModerator && infoConf.getUserRole() == 'moderator') {
            console.log('1111endjoin3');
            infoConf.setIsHostHangup();
        }

        if (service == 'onechat') {
            console.log('1111endjoin4');
            await axios.post(
                domainEnd + '/service/endjoin',
                {
                    meetingid: meetingId,
                    name: nameJoin,
                    tag: 'onechat',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + secretKeyOnechat,
                    },
                }
            );
        } else if (service == 'manageAi') {
            console.log('1111endjoin5');
            await axios.post(
                domainEnd + '/service/endjoin',
                {
                    meetingid: meetingId,
                    name: nameJoin,
                    tag: 'ManageAi',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + secretKeyManageAi,
                    },
                }
            );
        } else if (service == 'onemail') {
            console.log('1111endjoin6');
            if (isModerator) {
                await axios.post(
                    interfaceConfig.DOMAIN_ONEMAIL +
                        '/api/v1/oneconf/service/hangup',
                    {
                        meeting_id: meetingId,
                        user_id: userId,
                        tag: 'onemail',
                    }
                );
            } else {
                console.log('1111endjoin7');
                await axios.post(
                    interfaceConfig.DOMAIN_ONEMAIL +
                        '/api/v1/oneconf/service/hangup',
                    {
                        meeting_id: meetingId,
                        user_id: userId,
                        tag: 'onemail',
                    }
                );
            }
        } else if (service == 'onemail_dga') {
            console.log('1111endjoin8');
            await axios.post(interfaceConfig.DOMAIN_ONEMAIL_DGA + '/endJoin', {
                user_id: userId.split('-')[0],
                meeting_id: meetingId,
            });
        } else if (service == 'onedental') {
            console.log('1111endjoin9');
            await axios.post(
                domainEnd + '/service/endjoin',
                {
                    meetingid: meetingId,
                    name: nameJoin,
                    tag: 'onedental',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + secretKeyOneDental,
                    },
                }
            );
        } else if (service == 'onebinar') {
            console.log('1111endjoin10');
            await axios.post(
                domainEnd + '/service/endjoin',
                {
                    meetingid: meetingId,
                    name: nameJoin,
                    tag: 'onebinar',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + secretKeyOneBinar,
                    },
                }
            );
        } else if (service == 'jmc') {
            console.log('1111endjoin11');
            await axios.post(
                domainEnd + '/service/endjoin',
                {
                    meetingid: meetingId,
                    name: nameJoin,
                    tag: 'jmc',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + secretKeyJmc,
                    },
                }
            );
        } else if (service == 'telemedicine') {
            console.log('1111endjoin12');
            await axios.post(
                domainEnd + '/service/endjoin',
                {
                    meetingid: meetingId,
                    name: nameJoin,
                    tag: 'telemedicine',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + secretKeyTelemedicine,
                    },
                }
            );
        } else if (service == 'emeeting') {
            console.log('1111endjoin13');
            await axios.post(
                domainEnd + '/service/endjoin',
                {
                    meetingid: meetingId,
                    name: nameJoin,
                    tag: 'emeeting',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + secretKeyEmeeting,
                    },
                }
            );
        } else if (service == 'education') {
            console.log('1111endjoin14');
            await axios.post(
                domainEnd + '/service/endjoin',
                {
                    meetingid: meetingId,
                    name: nameJoin,
                    tag: 'education',
                },
                {
                    headers: {
                        Authorization: 'Bearer ' + secretKeyEducation,
                    },
                }
            );
        } else {
            console.log('1111endjoin15');
            console.log('1111endjoin15.1', {userId, meetingId});
            await axios.post(interfaceConfig.DOMAIN + '/endJoin', {
                user_id: userId,
                meeting_id: meetingId,
            });
        }

        APP.store.dispatch(disconnect(true));
    } catch (error) {
        console.log('1111endjoin16');
        console.log(error);
    }
}
