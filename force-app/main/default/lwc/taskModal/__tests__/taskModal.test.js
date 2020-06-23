import { createElement } from 'lwc';
import TaskModal from 'c/taskModal';

describe('c-task-modal', () => {
    const TASK = {
        "description": "Task 1 Description",
            "taskId": "a010R000008NirsQAC",
            "taskName": "Task 1"
    };
    const OBJECT_API_NAME = 'To_Do_Task__c';
    const FIELDS = ['Name', 'Description__c'];


    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('propogates close event on clicking close button', () => {
        const element = createElement('c-task-modal', {
            is: TaskModal
        });
        element.mode = 'edit';
        element.task = TASK;
        element.objectApiName = OBJECT_API_NAME;
        element.fields = FIELDS;
        document.body.appendChild(element);

        // Listen for delete task event
        const handler = jest.fn();
        element.addEventListener('cancelmodal', handler);

        return Promise.resolve().then(() => {
            // Click close button
            const closeButton = element.shadowRoot.querySelector('.close-button');
            closeButton.click();
        }).then(() => {
            expect(handler).toBeCalled();
        })
    });

    it('propogates close event on clicking reset button', () => {
        const element = createElement('c-task-modal', {
            is: TaskModal
        });
        element.mode = 'edit';
        element.task = TASK;
        element.objectApiName = OBJECT_API_NAME;
        element.fields = FIELDS;
        document.body.appendChild(element);

        // Listen for delete task event
        const handler = jest.fn();
        element.addEventListener('cancelmodal', handler);

        return Promise.resolve().then(() => {
            // Click close button
            const resetButton = element.shadowRoot.querySelector('.reset-button');
            resetButton.click();
        }).then(() => {
            expect(handler).toBeCalled();
        })
    });

    it('sets New Task as title in create mode', () => {
        const element = createElement('c-task-modal', {
            is: TaskModal
        });
        element.mode = 'create';
        element.objectApiName = OBJECT_API_NAME;
        element.fields = FIELDS;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            // Check modal title
            const modalTitle = element.shadowRoot.querySelector('h2[data-id="modal-heading-01"]');
            expect(modalTitle.textContent).toBe('New Task');
        });
    });

    it('sets task title as title in edit mode', () => {
        const element = createElement('c-task-modal', {
            is: TaskModal
        });
        element.mode = 'edit';
        element.task = TASK;
        element.objectApiName = OBJECT_API_NAME;
        element.fields = FIELDS;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            // Check modal title
            const modalTitle = element.shadowRoot.querySelector('h2[data-id="modal-heading-01"]');

            const x = element.shadowRoot.querySelector('lightning-record-edit-form');
            x.click();


            expect(modalTitle.textContent).not.toBe('New Task');
            expect(modalTitle.textContent).toBe(element.task.taskName);
        });
    });
});