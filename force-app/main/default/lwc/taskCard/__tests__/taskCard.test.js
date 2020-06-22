import { createElement } from 'lwc';
import TaskCard from 'c/taskCard';

describe('c-task-card', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('opens taskModal on click', () => {
        let element = createElement('c-task-card', {
            is: TaskCard
        });
        element.task = {
            "description": "Task 1 Description",
            "taskId": "a010R000008NirsQAC",
            "taskName": "Task 1"
          };
        document.body.appendChild(element);

        // Select card for simulating click
        const cardBody = element.shadowRoot.querySelector('.task-spacer');

        // Modal defaults to closed?
        let pageModal = element.shadowRoot.querySelector('c-task-modal');
        expect(pageModal).toBe(null);

        // Modal opens on click?
        cardBody.click();
        return Promise.resolve().then(() => {
            pageModal = element.shadowRoot.querySelector('c-task-modal');
            // Compare if tracked property has been assigned a new value.
            expect(pageModal).not.toBe(null);
        });
        
    });

    it('dispatches delete task event on button click', () => {
        let element = createElement('c-task-card', {
            is: TaskCard
        });
        element.task = {
            "description": "Task 1 Description",
            "taskId": "a010R000008NirsQAC",
            "taskName": "Task 1"
          };
        document.body.appendChild(element);
        // Listen for delete task event
        const handler = jest.fn();
        element.addEventListener('deletetask', handler);

        // Click lightning menu to display buttons
        const lightningMenuButton = element.shadowRoot.querySelector('lightning-button-menu');
        lightningMenuButton.click();

        return Promise.resolve().then(() => {
            // Ensure modal event propogation was stopped
            let pageModal = element.shadowRoot.querySelector('c-task-modal');
            expect(pageModal).toBe(null);
            // Click delete button
            let deleteButton = element.shadowRoot.querySelector('.delete-button');
            deleteButton.click();
            }).then(() => {
                // Was delete task event dispatched?
                expect(handler).toBeCalled();
            });
    });

});