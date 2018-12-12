import { TOKEN, MAIN_URL } from "./config";

export const api = {
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

        return task;
    },
};
