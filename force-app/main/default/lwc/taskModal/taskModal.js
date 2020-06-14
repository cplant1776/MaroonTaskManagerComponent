import { LightningElement, api, track } from 'lwc';

export default class TaskModal extends LightningElement {
    @api task;
    @api mode;
    @api taskListId;

    @track title;

    @api objectApiName;
    @api fields;

    connectedCallback()
    {
        this.title = (this.task === undefined) ? 'New Task' : this.task.taskName;
    }

    handleReset(event)
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

    get isEdit()
    {
        return this.mode === 'edit';
    }

    get isCreate()
    {
        return this.mode === 'create';
    }
}