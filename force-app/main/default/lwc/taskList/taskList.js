import { LightningElement, api } from 'lwc';

export default class TaskList extends LightningElement {
    @api listName;
    @api taskList = [];
    @api taskListId

    connectedCallback()
    {
        
    }

}