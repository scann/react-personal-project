// Core
import React, { Component } from 'react';

//Components
import Task from '../../components/Task';
import Spinner from '../../components/Spinner';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from "../../theme/assets/Checkbox";
import { sortTasksByGroup } from "../../instruments";

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
        try {
            this._setTasksFetchingState(true);

            const tasks = await api.fetchTasks();

            this.setState({
                tasks: sortTasksByGroup(tasks),
            });
        } catch (e) {
            console.log(e);
        } finally {
            this._setTasksFetchingState(false);
        }

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
            tasks:          sortTasksByGroup([task, ...tasks]),
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

    _updateTask = async (updatedTask) => {
        try {
            this._setTasksFetchingState(true);

            const updatedTaskResponse = await api.updateTask(updatedTask);

            this.setState(({ tasks }) => {
                const indexOfReplaceableTask = tasks.indexOf(
                    tasks.find((task) => task.id === updatedTask.id)
                );
                const newTasks = [...tasks.filter((task) => task.id !== updatedTask.id)];
                const sortedTasks = sortTasksByGroup(newTasks.splice(indexOfReplaceableTask, 0, updatedTaskResponse));

                return { tasks: sortedTasks };
            });
        } catch (e) {
            console.log(e);
        } finally {
            this._setTasksFetchingState(false);
        }

    };

    render () {
        const { tasks, isSpinning, newTaskMessage } = this.state;

        const taskListJSX = tasks.map((task) => (
            <Task
                key = { task.id }
                { ...task }
                _removeTask = { this._removeTask }
                _updateTask = { this._updateTask }
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
