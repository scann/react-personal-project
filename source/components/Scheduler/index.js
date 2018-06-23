// Core
import React, { Component } from 'react';

// Instruments
import Styles from './styles.m.css';

export default class Scheduler extends Component {
    render () {
        return (
            <section className = { Styles.scheduler }>
                Планировщик: стартовая точка
            </section>
        );
    }
}
