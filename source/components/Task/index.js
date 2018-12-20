// Core
import React, { PureComponent, createRef } from 'react';
import { string, bool, func } from 'prop-types';
import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';
import Checkbox from "../../theme/assets/Checkbox";
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTaskAsync: func.isRequired,
        _updateTaskAsync: func.isRequired,
        completed:        bool.isRequired,
        favorite:         bool.isRequired,
        id:               string.isRequired,
        message:          string.isRequired,
    };

    state = {
        newMessage:    this.props.message,
        isTaskEditing: false,
    };

    taskInput = createRef();

    _getTaskShape = ({
        id = this.props.id,
        completed = this.props.completed,
        favorite = this.props.favorite,
        message = this.props.message,
    }) => ({
        id,
        completed,
        favorite,
        message,
    });

    _updateNewTaskMessage = (event) => {
        this.setState({
            newMessage: event.target.value,
        });
    };

    _setTaskEditingState = (isTaskEditing) => {
        this.setState({
            isTaskEditing,
        },
        () => {
            if (isTaskEditing) {
                this.taskInput.current.focus();
            }
        },
        );
    };

    _removeTask = () => {
        const { _removeTaskAsync, id } = this.props;

        _removeTaskAsync(id);
    };

    _updateTask = () => {
        const { _updateTaskAsync, id, completed, favorite, message } = this.props;
        const { newMessage } = this.state;

        if (message === newMessage) {
            this._setTaskEditingState(false);

            return null;
        }
        _updateTaskAsync({ id, completed, favorite, message: newMessage });
        this._setTaskEditingState(false);
    };

    _updateTaskMessageOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }
        this._setTaskEditingState(true);
    };

    _cancelUpdatingTaskMessage = () => {
        const { message } = this.props;

        this.setState({
            newMessage:    message,
            isTaskEditing: false,
        });
    };

    _updateTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        if (!newMessage) {
            return null;
        }

        if (event.key === 'Enter') {
            this._updateTask();
        } else if (event.key === 'Escape') {
            this._cancelUpdatingTaskMessage();
        }
    };

    _toggleTaskCompletedState = () => {
        const { _updateTaskAsync, completed } = this.props;
        const completedTask = this._getTaskShape({ completed: !completed });

        _updateTaskAsync(completedTask);
    };

    _toggleTaskFavoriteState = () => {
        const { _updateTaskAsync, favorite } = this.props;
        const favoriteTask = this._getTaskShape({ favorite: !favorite });

        _updateTaskAsync(favoriteTask);
    };

    render () {
        const { isTaskEditing, newMessage } = this.state;
        const { message, favorite, completed } = this.props;

        const taskStyles = cx(Styles.task, {
            [Styles.completed]: completed,
        });
        const currentMessage = isTaskEditing ? newMessage : message;

        return (
            <li className = { taskStyles }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3B8EF3'
                        color2 = '#FFF'
                        onClick = { this._toggleTaskCompletedState }

                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        ref = { this.taskInput }
                        type = 'text'
                        value = { currentMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._updateTaskMessageOnClick }
                    />
                    <Remove
                        inlineBlock
                        className = { Styles.removeTask }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
