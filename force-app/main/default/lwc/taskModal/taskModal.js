import { LightningElement, api } from 'lwc';

export default class TaskModal extends LightningElement {
    @api task;
    @api title;
    @api mode;

    @api objectApiName;
    @api fields;

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

    get isEdit()
    {
        return this.mode === 'edit';
    }
}