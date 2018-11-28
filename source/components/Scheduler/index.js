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
        isSpinning:     true,
        tasks:          [
            { id: '123', completed: true, favorite: false, message: 'Read the book' },
            { id: '456', completed: false, favorite: true, message: 'Clean my room' }
        ],
    };

    render () {
        const { tasks, isSpinning, newTaskMessage } = this.state;

        const taskListJSX = tasks.map((task) => (
            <Task
                key = { task.id }
                { ...task }
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
                        <form>
                            <input
                                maxLength = { 50 }
                                placeholder = { `Описание моей новой задачи` }
                                type = 'text'
                                value = { newTaskMessage }
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
