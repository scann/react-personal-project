// Core
import React, { Component } from 'react';
import cx from 'classnames';

// Instruments
import Styles from './styles.m.css';

export default class Spinner extends Component {
    render () {
        const { spin, mini } = this.props;

        const styles = cx(Styles.spinner, {
            [Styles.mini]: mini,
        });

        return spin ? <div className = { styles } /> : null;
    }
}
