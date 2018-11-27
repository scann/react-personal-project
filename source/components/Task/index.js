// Core
import React, { PureComponent } from 'react';

// Instruments
import Styles from './styles.m.css';
import Checkbox from "../../theme/assets/Checkbox";
import Star from '../../theme/assets/Star';
import Edit from '../../theme/assets/Edit';
import Remove from '../../theme/assets/Remove';

export default class Task extends PureComponent {
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

    render () {
        return (
            <li className = { Styles.task }>
                <div className = { Styles.content }>
                    <div className = { Styles.toggleTaskCompletedState }>
                        <Checkbox
                            inlineBlock
                            color1 = '#3b8ef3'
                            color2 = '#FFF'
                        />
                    </div>
                    <input maxLength = { 50 } type = 'text' />
                </div>
                <div className = { Styles.actions }>
                    <Star
                        inlineBlock
                        color1 = '#3b8ef3'
                        className = { Styles.toggleTaskFavoriteState }
                    />
                    <Edit
                        inlineBlock
                        color1 = '#3b8ef3'
                        className = { Styles.updateTaskMessageOnClick }
                    />
                    <Remove
                        inlineBlock
                        color1 = '#3b8ef3'
                    />
                </div>
            </li>
        );
    }
}
