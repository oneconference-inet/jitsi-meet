// @flow
import { type Dispatch } from 'redux';

import { openDialog } from '../../base/dialog';
import { translate } from '../../base/i18n';
import { IconPoll } from '../../base/icons';
import { connect } from '../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../base/toolbox/components';

import { PollCreateDialog } from '.';

/**
 * The type of the React {@code Component} props of {@link PollCreateButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Dispatch<any>,

    /**
     * The i18n translate function.
     */
    t: Function
};


/**
 * A button for creating polls
 */
class PollCreateButton<P: Props> extends AbstractButton<P, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.poll';
    icon = IconPoll;
    label = 'toolbar.poll';
    tooltip = 'toolbar.poll';

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch(openDialog(PollCreateDialog));
    }
}

export default translate(connect()(PollCreateButton));