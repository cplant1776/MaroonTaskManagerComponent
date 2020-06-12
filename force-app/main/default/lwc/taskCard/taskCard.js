import { LightningElement, api } from 'lwc';

export default class TaskCard extends LightningElement {
    @api task;

    handleDragStart()
    {
        console.log('taskCard :: start drag => ' + this.task.taskId);
        const dragStartEvent = new CustomEvent('itemdrag', {detail: this.task});
        this.dispatchEvent(dragStartEvent);
    }
}