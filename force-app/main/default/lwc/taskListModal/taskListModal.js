import { LightningElement, api, track } from 'lwc';

export default class TaskListModal extends LightningElement {
    @api list;
    @api objectApiName;

    @track title;

    connectedCallback()
    {        
        if(this.list === null)
        {
            this.title = 'New Todo List';
        } else
        {
            this.title = this.list.listName;
        }
        // this.title = (this.list === null) ? 'New Todo List' : this.list.listName;
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

    handleSuccess(event)
    {
        console.log('taskListModal :: handleSuccess');
        

        const createListEvent = new CustomEvent('createlist', {detail: event.detail});
        this.dispatchEvent(createListEvent);
    }

    get isEdit()
    {
        return this.list === null ? false : true;
    }

    get listId()
    {
        return this.list === null ? '' : this.list.listId;
    }
}