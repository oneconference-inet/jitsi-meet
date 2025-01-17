// @flow

import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import logger from '../../../base/redux/logger';

import { withPixelLineHeight } from '../../../base/styles/functions.web';
import { admitMultiple } from '../../../lobby/actions.web';
import { getKnockingParticipants, getLobbyEnabled } from '../../../lobby/functions';

import { LobbyParticipantItem } from './LobbyParticipantItem';

const useStyles = makeStyles(theme => {
    return {
        headingContainer: {
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between'
        },
        heading: {
            ...withPixelLineHeight(theme.typography.heading7),
            color: theme.palette.text02
        },
        link: {
            ...withPixelLineHeight(theme.typography.labelBold),
            color: theme.palette.link01,
            cursor: 'pointer'
        }
    };
});


export const LobbyParticipantList = () => {
    const lobbyEnabled = useSelector(getLobbyEnabled);
    const participants = useSelector(getKnockingParticipants);

    
    const { t } = useTranslation();
    const classes = useStyles();
    const dispatch = useDispatch();
    const admitAll = useCallback(() => {
        dispatch(admitMultiple(participants));
    }, [ dispatch, participants ]);

    if (!participants.length) {
        return null;
    }

    return (
    <>
        <div className = { classes.headingContainer }>
            <div className = { classes.heading }>
                {t('participantsPane.headings.lobby', { count: participants.length })}
            </div>
            {
                participants.length > 1 && (
                    <div
                        className = { classes.link }
                        onClick = { admitAll }>{t('lobby.allowAll')}</div>
                )
            }
        </div>
        <div>
            {participants.map(p => (
                <LobbyParticipantItem
                    key = { p.id }
                    participant = { p } />)
            )}
        </div>
    </>
    );
};
