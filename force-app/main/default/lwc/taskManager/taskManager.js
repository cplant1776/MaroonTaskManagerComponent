import { LightningElement, track } from 'lwc';
import getUserToDoLists from '@salesforce/apex/TaskManagerController.getUserToDoLists';

export default class TaskManager extends LightningElement {
    @track taskLists = [];

    connectedCallback()
    {
        // this.populateDummyData();
        this.fetchUserTodoLists();
    }

    fetchUserTodoLists()
    {
        getUserToDoLists({source: 'placeholder'}).then(result => {
            if(result)
            {
                console.log("Size retrieved from server: ", result.length);
                console.log(result);
                
                this.taskLists = result;
            }
        }).catch(error => {
            console.log("Error fetching user todo lists!");
            console.log(error);
        });
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