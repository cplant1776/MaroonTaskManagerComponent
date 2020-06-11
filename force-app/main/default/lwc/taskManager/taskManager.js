import { LightningElement, track } from 'lwc';

export default class TaskManager extends LightningElement {
    @track taskLists = [];

    connectedCallback()
    {
        this.populateDummyData();
    }

    populateDummyData()
    {
        const taskLists = [
            {
                listName: 'LIST 1 BRO',
                taskListId: '123',
                taskList:
                [
                    {
                        description: 'list 1 task 1'
                    },
                    {
                        description: 'list 1 task 2'
                    },
                    {
                        description: 'list 1 task 3'
                    },
                    {
                        description: 'list 1 task 4'
                    }
                ]
            },
            {
                listName: 'LIST 2 BRO',
                taskListId: 'abc',
                taskList:
                [
                    {
                        description: 'list 2 task 1'
                    },
                    {
                        description: 'list 2 task 2'
                    }
                ]
            }
        ];

        this.taskLists = taskLists;
    }
}