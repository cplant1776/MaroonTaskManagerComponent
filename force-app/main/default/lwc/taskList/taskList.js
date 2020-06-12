import { LightningElement, api, track } from 'lwc';

export default class TaskList extends LightningElement {
    @api listName;
    @api taskList = [];
    @api taskListId

    connectedCallback()
    {
        
    }

    handleItemDrag(event)
    {
        console.log('taskList :: item drag');        

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