// Core
import React, { PureComponent, createRef } from 'react';
import { string, bool, func } from 'prop-types';

// Instruments
import Styles from './styles.m.css';
import Checkbox from "../../theme/assets/Checkbox";
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
    static propTypes = {
        _removeTask: func.isRequired,
        completed:   bool.isRequired,
        favorite:    bool.isRequired,
        id:          string.isRequired,
        message:     string.isRequired,
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

    _editTaskState = (isTaskEditing) => {
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
        const { _removeTask, id } = this.props;

        _removeTask(id);
    };

    _updateTask = () => {
        const { _updateTask, message } = this.props;
        const { newMessage } = this.state;

        if (message === newMessage) {
            this._editTaskState(false);

            return null;
        }
        _updateTask({ message: newMessage });
        this._editTaskState(false);
    };

    _updateTaskOnClick = () => {
        const { isTaskEditing } = this.state;

        if (isTaskEditing) {
            this._updateTask();

            return null;
        }
        this._editTaskState(true);
    };

    _cancelUpdateNewTaskMessage = () => {
        const { message } = this.props;

        this.setState({
            newMessage:    message,
            isTaskEditing: false,
        });
    };

    _updateNewTaskMessageOnKeyDown = (event) => {
        const { newMessage } = this.state;

        if (!newMessage) {
            return null;
        }

        if (event.key === 'Enter') {
            this._updateTask();
        } else if (event.key === 'Escape') {
            this._cancelUpdateNewTaskMessage();
        }
    };

    render () {
        const { isTaskEditing, newMessage } = this.state;
        const { message, favorite, completed } = this.props;

        const currentMessage = isTaskEditing ? newMessage : message;

        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <Checkbox
                        inlineBlock
                        checked = { completed }
                        className = { Styles.toggleTaskCompletedState }
                        color1 = '#3b8ef3'
                        color2 = '#FFF'
                    />
                    <input
                        disabled = { !isTaskEditing }
                        maxLength = { 50 }
                        type = 'text'
                        ref = { this.taskInput }
                        value = { currentMessage }
                        onChange = { this._updateNewTaskMessage }
                        onKeyDown = { this._updateNewTaskMessageOnKeyDown }
                    />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        checked = { favorite }
                        className = { Styles.toggleTaskFavoriteState }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                    />
                    <Edit
                        inlineBlock
                        checked = { isTaskEditing }
                        className = { Styles.updateTaskMessageOnClick }
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._updateTaskOnClick }
                    />
                    <Remove
                        inlineBlock
                        color1 = '#3B8EF3'
                        color2 = '#000'
                        onClick = { this._removeTask }
                    />
                </div>
            </li>
        );
    }
}
