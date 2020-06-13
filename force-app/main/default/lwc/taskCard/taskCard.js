import { LightningElement, api, track } from 'lwc';

export default class TaskCard extends LightningElement {
    @api task;
    @track openModal=false;

    modalObjectApiName='To_Do_Task__c';
    modalFields=['Name', 'Description__c'];

    handleDragStart()
    {
        console.log('taskCard :: start drag => ' + this.task.taskId);
        const dragStartEvent = new CustomEvent('itemdrag', {detail: this.task});
        this.dispatchEvent(dragStartEvent);
    }

    handleOpenModal()
    {
        console.log('taskCard :: handleOpenModal');
        this.openModal = true;
    }

    handleSubmitModal(event)
    {
        console.log('taskCard :: handleSubmitModal => Returned results:');
        console.log(event.detail.fields);
        this.openModal = false;
        
        let taskFields = event.detail.fields;
        taskFields.taskId = this.task.taskId;

        const submitModalEvent = new CustomEvent('submitmodal', {detail: event.detail.fields});
        this.dispatchEvent(submitModalEvent);
    }

    handleCancelModal(event)
    {
        console.log('taskCard :: handleCancelModal');
        this.openModal = false;
    }

    handleDoNothing()
    {
        event.stopPropagation();
    }
}