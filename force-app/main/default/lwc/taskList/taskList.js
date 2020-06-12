import { LightningElement, api } from 'lwc';

export default class TaskList extends LightningElement {
    @api listName;
    @api taskList = [];
    @api taskListId

    connectedCallback()
    {
        
    }

    handleMoveTask(event)
    {
        console.log('Caught in TaskList');
        const moveEvent = new CustomEvent('movetask', {detail: event.detail});
        this.dispatchEvent(moveEvent);
    }

}