import { createElement } from 'lwc';
import TaskListModal from 'c/taskListModal';

describe('c-task-list-modal', () => {
    const TASK_LIST = 
    {
        "listName": "Task List 1",
        "taskListId": "a005B000004wvYTQAY",
        "taskList": [
          {
            "description": "Task 2",
            "taskId": "a015B000008qbstQAA",
            "taskName": "Task 2"
          },
          {
            "description": "Task 1",
            "taskId": "a015B000008qbsoQAA",
            "taskName": "Task 1"
          }
        ]
      };
    
    const OBJECT_API_NAME = 'To_Do_List__c';

    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('sets New Todo List as title in create mode', () => {
        const element = createElement('c-task-list-modal', {
            is: TaskListModal
        });
        element.list = TASK_LIST;
        element.objectApiName = OBJECT_API_NAME;
        element.mode = 'create';
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            // Check modal title
            const modalTitle = element.shadowRoot.querySelector('h2[data-id="modal-heading-01"]');
            expect(modalTitle.textContent).toBe('New Todo List');
        });
    });

    it('propogates close event on clicking close button', () => {
        const element = createElement('c-task-list-modal', {
            is: TaskListModal
        });
        element.list = TASK_LIST;
        element.objectApiName = OBJECT_API_NAME;
        element.mode = 'create';
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

    it('propogates createlist event on clicking submit button', () => {
        const element = createElement('c-task-list-modal', {
            is: TaskListModal
        });
        element.list = TASK_LIST;
        element.objectApiName = OBJECT_API_NAME;
        element.mode = 'create';
        document.body.appendChild(element);

        // Listen for delete task event
        const handler = jest.fn();
        element.addEventListener('createlist', handler);

        return Promise.resolve().then(() => {
            // Click close button
            const lightningForm = element.shadowRoot.querySelector('lightning-record-form');
            lightningForm.dispatchEvent(new CustomEvent('success'));
        }).then(() => {
            expect(handler).toBeCalled();
        })
    });
});