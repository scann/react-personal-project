// Core
import React, { Component } from 'react';

//Components
import Task from '../../components/Task';
import Spinner from '../../components/Spinner';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from "../../theme/assets/Checkbox";

export default class Scheduler extends Component {
    state = {
        newTaskMessage: '',
        isSpinning:     false,
        tasks:          [],
    };

    componentDidMount () {
        this._fetchTasks();
    }
    _setTasksFetchingState = (state) => {
        this.setState({
            isSpinning: state,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _fetchTasks = async () => {
        this._setTasksFetchingState(true);

        const tasks = await api.fetchTasks();

        this.setState({
            tasks,
            isSpinning: false,
        });
    };

    _createTask = async (event) => {
        event.preventDefault();
        this._setTasksFetchingState(true);
        const { newTaskMessage } = this.state;

        if (!newTaskMessage) {
            return null;
        }

        const task = await api.createTask(newTaskMessage);

        this.setState(({ tasks }) => ({
            tasks:          [task, ...tasks],
            newTaskMessage: '',
        }));
        this._setTasksFetchingState(false);
    };

    _removeTask = async (id) => {
        this._setTasksFetchingState(true);

        await api.removeTask(id);
        this.setState(({ tasks }) => ({
            tasks: tasks.filter((task) => task.id !== id),
        }));
        this._setTasksFetchingState(false);
    };

    render () {
        const { tasks, isSpinning, newTaskMessage } = this.state;

        const taskListJSX = tasks.map((task) => (
            <Task
                key = { task.id }
                { ...task }
                _removeTask = { this._removeTask }
            />
        ));

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isSpinning } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = { `Поиск` }
                            type = 'search'
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTask }>
                            <input
                                maxLength = { 50 }
                                placeholder = { `Описание моей новой задачи` }
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <ul>
                            { taskListJSX }
                        </ul>
                    </section>
                    <footer>
                        <Checkbox
                            inlineBlock
                            color1 = '#000'
                            color2 = '#FFF'
                        />
                        <span className = { Styles.completeAllTasks }>
                            Все задачи выполнены
                        </span>
                    </footer>
                </main>
            </section>
        );
    }
}
