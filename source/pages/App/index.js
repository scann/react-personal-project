// Core
import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import Scheduler from "../../components/Scheduler";
import Task from "../../components/Task";

@hot(module)
export default class App extends Component {
    render () {
        return (
            <Scheduler>
                <Task />
            </Scheduler>
        );
    }
}
