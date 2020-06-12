import { LightningElement, track } from 'lwc';
import getUserToDoLists from '@salesforce/apex/TaskManagerController.getUserToDoLists';
import moveTodoTask from '@salesforce/apex/TaskManagerController.moveTodoTask';

export default class TaskManager extends LightningElement {
    @track taskLists = [];

    connectedCallback()
    {
        this.fetchUserTodoLists();
    }

    // handleMoveTask(event)
    // {
    //     console.log('Caught in taskManager');
    //     console.log('Event detail: ' + event.detail);
        
    // }
    
    handleMoveTask(event)
    {
        console.log('Caught in taskManager');
        console.log('Event detail: ' + event.detail);

        const targetListId = 'a000R00000341ttQAA';
        moveTodoTask({taskId: event.detail, targetListId: targetListId}).then(result => {
            console.log('Successfully moved task.');
            console.log(result);
        }).catch(error => {
            console.log('Error moving task!');
            console.log(error);
        });
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
}