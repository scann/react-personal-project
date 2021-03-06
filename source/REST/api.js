import { TOKEN, MAIN_URL } from "./config";

export const api = {
    async fetchTasks () {
        const response = await fetch(MAIN_URL, {
            method:  'GET',
            headers: {
                Authorization: TOKEN,
            },
        });
        const { data: tasks } = await response.json();

        if (response.status === 200) {
            return tasks;
        }
    },

    async createTask (newTaskMessage) {
        const response = await fetch(MAIN_URL, {
            method:  'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify({ message: newTaskMessage }),
        });
        const { data: task } = await response.json();

        if (response.status === 200) {
            return task;
        }
    },

    async removeTask (id) {
        const response = await fetch(`${MAIN_URL}/${id}`, {
            method:  'DELETE',
            headers: {
                Authorization: TOKEN,
            },
        });

        if (response.status !== 204) {
            console.log('Error! Task was not deleted!');
        }
    },

    async updateTask (updatedTask) {
        const response = await fetch(MAIN_URL, {
            method:  'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization:  TOKEN,
            },
            body: JSON.stringify([updatedTask]),
        });
        const { data: [updatedTaskResponse] } = await response.json();

        if (response.status === 200) {
            return updatedTaskResponse;
        }
    },

    async completeAllTasks (tasks) {
        const taskPromises = [];

        for (const task of tasks) {
            taskPromises.push(
                fetch(MAIN_URL, {
                    method:  'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization:  TOKEN,
                    },
                    body: JSON.stringify([{ ...task, completed: true }]),
                }),
            );
        }
        const responses = await Promise.all(taskPromises);

        for (const response of responses) {
            if (response.status !== 200) {
                console.log('Task was not completed');
            }
        }
    },
};
