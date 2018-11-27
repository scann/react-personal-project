// Core
import React, { Component } from 'react';

//Components
import Task from '../../components/Task';

// Instruments
import Styles from './styles.m.css';
import { api } from '../../REST'; // ! Импорт модуля API должен иметь именно такой вид (import { api } from '../../REST')
import Checkbox from "../../theme/assets/Checkbox";

export default class Scheduler extends Component {
    render () {
        return (
            <section className = { Styles.scheduler }>
                <main>
                    <header>
                        <h1>Планировщик задач</h1>
                        <input placeholder = { `Поиск` } type = 'search' />
                    </header>
                    <section>
                        <form>
                            <input placeholder = { `Описание моей новой задачи` } type = 'text' />
                            <button>Добавить задачу</button>
                        </form>
                        <ul>
                            <Task />
                        </ul>
                    </section>
                    <footer>
                        <Checkbox
                            inlineBlock
                            color1 = '#000'
                            color2 = '#FFF'
                        />
                        <span className = { Styles.completeAllTasks }>Все задачи выполнены</span>
                    </footer>
                </main>
            </section>
        );
    }
}
