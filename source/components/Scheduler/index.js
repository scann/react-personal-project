// Core
import React, { Component } from 'react';
import FlipMove from 'react-flip-move';

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
        newTaskMessage:  '',
        tasksFilter:     '',
        isTasksFetching: false,
        tasks:           [],
    };

    _getAllCompleted = () => this.state.tasks.every((task) => task.completed);

    componentDidMount () {
        this._fetchTasksAsync();
    }

    _setTasksFetchingState = (state) => {
        this.setState({
            isTasksFetching: state,
        });
    };

    _updateNewTaskMessage = (event) => {
        this.setState({
            newTaskMessage: event.target.value,
        });
    };

    _updateTasksFilter = (event) => {
        this.setState({ tasksFilter: event.target.value.toLowerCase() });
    };

    _fetchTasksAsync = async () => {
        try {
            this._setTasksFetchingState(true);

            const tasks = await api.fetchTasks();

            this.setState({
                tasks: sortTasksByGroup(tasks),
            });
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _createTaskAsync = async (event) => {
        try {
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
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _removeTaskAsync = async (id) => {
        try {
            this._setTasksFetchingState(true);

            await api.removeTask(id);
            this.setState(({ tasks }) => ({
                tasks: tasks.filter((task) => task.id !== id),
            }));
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _updateTaskAsync = async (updatedTask) => {
        try {
            this._setTasksFetchingState(true);

            const updatedTaskResponse = await api.updateTask(updatedTask);

            this.setState(({ tasks }) => {
                const indexOfReplaceableTask = tasks.indexOf(
                    tasks.find((task) => task.id === updatedTask.id)
                );
                const newTasks = tasks.filter((task) => task.id !== updatedTask.id);

                newTasks.splice(indexOfReplaceableTask, 0, updatedTaskResponse);
                const resultTasks = sortTasksByGroup(newTasks);

                return { tasks: resultTasks };
            });
        } catch (error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    _completeAllTasksAsync = async () => {
        try {
            if (this._getAllCompleted()) {
                return null;
            }
            this._setTasksFetchingState(true);
            await api.completeAllTasks(this.state.tasks);

            this.setState(({ tasks }) => ({
                tasks: sortTasksByGroup(tasks.map((task) => ({ ...task, completed: true }))),
            }));
        } catch(error) {
            console.log(error.message);
        } finally {
            this._setTasksFetchingState(false);
        }
    };

    render () {
        const { tasks, isTasksFetching, newTaskMessage, tasksFilter } = this.state;

        const allTasksCompleted = this._getAllCompleted();

        const taskListJSX = tasks
            .filter((task) => task.message.toLowerCase().includes(tasksFilter))
            .map((task) => (
                <Task
                    key = { task.id }
                    { ...task }
                    _removeTaskAsync = { this._removeTaskAsync }
                    _updateTaskAsync = { this._updateTaskAsync }
                />
            ));

        return (
            <section className = { Styles.scheduler }>
                <main>
                    <Spinner isSpinning = { isTasksFetching } />
                    <header>
                        <h1>Планировщик задач</h1>
                        <input
                            placeholder = { `Поиск` }
                            type = 'search'
                            value = { tasksFilter }
                            onChange = { this._updateTasksFilter }
                        />
                    </header>
                    <section>
                        <form onSubmit = { this._createTaskAsync }>
                            <input
                                className = { Styles.createTask }
                                maxLength = { 50 }
                                placeholder = { `Описание моей новой задачи` }
                                type = 'text'
                                value = { newTaskMessage }
                                onChange = { this._updateNewTaskMessage }
                            />
                            <button>Добавить задачу</button>
                        </form>
                        <div>
                            <ul>
                                <FlipMove
                                    enterAnimation = { {
                                        from: {
                                            transform: 'rotateX(180deg)',
                                            opacity:   0.1,
                                        },
                                        to: {
                                            transform: '',
                                        },
                                    } }
                                    leaveAnimation = { {
                                        from: {
                                            transform: '',
                                        },
                                        to: {
                                            transform: 'rotateX(-120deg)',
                                            opacity:   0.1,
                                        },
                                    } }
                                    staggerDelayBy = { 100 }>
                                    { taskListJSX }
                                </FlipMove>
                            </ul>
                        </div>
                    </section>
                    <footer>
                        <Checkbox
                            checked = { allTasksCompleted }
                            color1 = '#363636'
                            color2 = '#fff'
                            onClick = { this._completeAllTasksAsync }
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
