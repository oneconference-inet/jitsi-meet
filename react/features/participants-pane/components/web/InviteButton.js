// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { createToolbarEvent, sendAnalytics } from "../../../analytics";
import { Icon, IconInviteMore } from "../../../base/icons";
import { beginAddPeople } from "../../../invite";

import { ParticipantInviteButton } from "./styled";


import {
    createHandlers,
    handleDecode,
} from "../../../../features/analytics/functions.js";

export const InviteButton = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const onInvite = useCallback(() => {
        sendAnalytics(createToolbarEvent("invite"));
        dispatch(beginAddPeople());
    }, [dispatch]);
    const typeOption = false;

    logger.log("handleDecode=>>>>>>>>>>>>",handleDecode)

    return (
        <div>
            {typeOption == true ? (
                <div style={{ display: "none" }}>
                    <ParticipantInviteButton
                        aria-label={t("participantsPane.actions.invite")}
                        onClick={onInvite}
                    >
                        <Icon size={20} src={IconInviteMore} />
                        <span>{t("participantsPane.actions.invite")}</span>
                    </ParticipantInviteButton>
                </div>
            ) : (
                <ParticipantInviteButton
                    aria-label={t("participantsPane.actions.invite")}
                    onClick={onInvite}
                >
                    <Icon size={20} src={IconInviteMore} />
                    <span>{t("participantsPane.actions.invite")}</span>
                </ParticipantInviteButton>
            )}
        </div>
    );
};
