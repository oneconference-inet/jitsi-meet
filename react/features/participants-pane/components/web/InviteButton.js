// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { createToolbarEvent, sendAnalytics } from "../../../analytics";
import { Icon, IconInviteMore } from "../../../base/icons";
import { beginAddPeople } from "../../../invite";

import { ParticipantInviteButton } from "./styled";

import infoConf from "../../../../../infoConference";

// import {createHandlers} from "D:\INET\Project\jitsi-meet\react\features\analytics\functions.js";
import { createHandlers } from "../../../../features/analytics/functions.js";
import logger from "../../../analytics/logger";

export const InviteButton = ({ getState }: { getState: Function }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const onInvite = useCallback(() => {
        sendAnalytics(createToolbarEvent("invite"));
        dispatch(beginAddPeople());
    }, [dispatch]);
    const typeOption = infoConf.getVoice();
    //logger.log(typeOption, "typeoption");

    const state = getState();
    const config = state["features/base/config"];
    const { locationURL } = state["features/base/connection"];
    const meetingIdForCheck = locationURL.href.split("/")[3].split("?")[0];
    const tokenDecode = locationURL.href.split("?")[1];
    const dataDecode = decode(tokenDecode, true);

    //logger.log("dataDecode inviteButton=>>>>>>>>>>>>", dataDecode);

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
