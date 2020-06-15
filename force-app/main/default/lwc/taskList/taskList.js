import { LightningElement, api, track } from 'lwc';

export default class TaskList extends LightningElement {
    @api listName;
    @api taskList = [];
    @api taskListId

    @track openModal=false;

    createModalObjectApiName='To_Do_Task__c';
    createModalFields=['Name', 'Description__c', 'To_Do_List__c'];

    connectedCallback()
    {
        this.createModalFields = [

            {apiName: 'Name',
            mode: 'edit',
            defaultValue: ''},
    
            {apiName: 'Description__c',
            mode: 'edit',
            defaultValue: ''},
    
            {apiName: 'To_Do_List__c',
            mode: 'read-only',
            defaultValue: this.taskListId}
        ];
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

    handleSubmitModal(event)
    {
        console.log('taskList :: handleSubmitModal');

        let taskFields = event.detail;
        taskFields.taskListId = this.taskListId;

        const submitModalEvent = new CustomEvent('submitmodal', {detail: taskFields});
        this.dispatchEvent(submitModalEvent);
    }

    handleCreateModal(event)
    {
        console.log('taskCard :: handleCreateModal');
        console.log(event.detail);

        this.handleCloseModal();
        
        const taskCreatedEvent = new CustomEvent('createtask', {detail: event.detail});
        this.dispatchEvent(taskCreatedEvent);
    }

    handleDeleteTask(event)
    {
        console.log('taskList :: handleDeleteTask');

        let updatedDetail = {
            taskId: event.detail,
            taskListId: this.taskListId
        }

        const deleteTaskEvent = new CustomEvent('deletetask', {detail: updatedDetail});
        this.dispatchEvent(deleteTaskEvent);
        
    }

    handleOpenModal()
    {
        this.openModal = true;
    }

    handleCloseModal()
    {
        this.openModal = false;
    }

}