import { LightningElement, api } from 'lwc';

export default class TaskCard extends LightningElement {
    @api task;

    handleMoveTask()
    {
        const moveEvent = new CustomEvent('movetask', {detail: this.task.taskId});
        this.dispatchEvent(moveEvent);
    }

    handleDragStart()
    {
        console.log('taskCard :: start drag => ' + this.task.taskId);
        const dragStartEvent = new CustomEvent('itemdrag', {detail: this.task});
        this.dispatchEvent(dragStartEvent);
    }
}