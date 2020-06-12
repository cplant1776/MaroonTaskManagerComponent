import { LightningElement, track } from 'lwc';
import getUserToDoLists from '@salesforce/apex/TaskManagerController.getUserToDoLists';

export default class TaskManager extends LightningElement {
    @track taskLists = [];

    connectedCallback()
    {
        this.fetchUserTodoLists();
    }

    handleMoveTask(event)
    {
        console.log('Caught in taskManager');
        console.log('Event detail: ' + event.detail);
        
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