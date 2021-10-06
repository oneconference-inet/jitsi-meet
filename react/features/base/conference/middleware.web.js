// @flow

import { setPrejoinPageVisibility, setSkipPrejoinOnReload } from '../../prejoin';
import { PREJOIN_SCREEN_STATES } from '../../prejoin/constants';
import UIEvents from "../../../../service/UI/UIEvents";
import { MiddlewareRegistry } from "../redux";
import { TOGGLE_SCREENSHARING } from "../tracks/actionTypes";
import { JitsiConferenceErrors } from "../lib-jitsi-meet";

import { CONFERENCE_FAILED, CONFERENCE_JOINED } from "./actionTypes";
import "./middleware.any";

declare var APP: Object;

MiddlewareRegistry.register(({ dispatch, getState }) => next => action => {
    const { enableForcedReload } = getState()['features/base/config'];

    switch (action.type) {
        case TOGGLE_SCREENSHARING: {
            if (typeof APP === "object") {
                APP.UI.emitEvent(UIEvents.TOGGLE_SCREENSHARING);
            }
            break;
        }
        
        case CONFERENCE_JOINED: {
            if (enableForcedReload) {
                dispatch(setPrejoinPageVisibility(PREJOIN_SCREEN_STATES.HIDDEN));
                dispatch(setSkipPrejoinOnReload(false));
            }
        }

        case CONFERENCE_FAILED: {
            enableForcedReload &&
                action.error?.name ===
                    JitsiConferenceErrors.CONFERENCE_RESTARTED &&
                dispatch(setSkipPrejoinOnReload(true));

            break;
        }
    }

    return next(action);
});
