import { LightningElement, api, track } from 'lwc';

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

    handleItemDrag(event)
    {
        console.log('taskList :: item drag');
        console.log(event.detail);
        

        const itemDragEvent = new CustomEvent('listitemdrag', {detail: event.detail});
        this.dispatchEvent(itemDragEvent);
    }

    handleDragOver(event)
    {
        event.preventDefault();
    }

    handleDrop()
    {
        console.log('taskList :: item drop');
        const itemDropEvent = new CustomEvent('itemdrop', {detail: this.taskListId});
        this.dispatchEvent(itemDropEvent);
    }

}