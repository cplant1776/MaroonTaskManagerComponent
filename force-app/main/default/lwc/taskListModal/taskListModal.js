import { LightningElement, api, track } from 'lwc';

export default class TaskListModal extends LightningElement {
    @api list;
    @api objectApiName;
    // @api mode; TODO: implement edit mode
    @track mode = 'create';

    @track title;

    connectedCallback()
    {
        this.title = (this.mode === 'create') ? 'New Todo List' : this.list.listName;
    }

    handleReset()
    {
        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );
        if (inputFields) {
            inputFields.forEach(field => {
                field.reset();
            });
        };

        const cancelModalEvent = new CustomEvent('cancelmodal');
        this.dispatchEvent(cancelModalEvent);
    }

    handleClose()
    {
        const cancelModalEvent = new CustomEvent('cancelmodal');
        this.dispatchEvent(cancelModalEvent);
    }

    handleSuccess(event)
    {
        console.log('taskListModal :: handleSuccess');
        

        const createListEvent = new CustomEvent('createlist', {detail: event.detail});
        this.dispatchEvent(createListEvent);
    }

    get isEdit()
    {
        return this.mode === 'edit';
    }

    get isCreate()
    {
        return this.mode === 'create';
    }

    get listId()
    {
        return this.list === null ? '' : this.list.listId;
    }
}