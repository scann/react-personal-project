// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';

@hot(module)
export default class App extends Component {
    render () {
        return (
            <h1
                style = { {
                    display:        'flex',
                    minHeight:      '100vh',
                    justifyContent: 'center',
                    alignItems:     'center',
                    fontSize:       32,
                    fontWeight:     700,
                    color:          'snow',
                    userSelect:     'none',
                } }>
                Персональный проект: стартовая точка
            </h1>
        );
    }
}
