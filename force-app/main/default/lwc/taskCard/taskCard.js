import { LightningElement, api } from 'lwc';

export default class TaskCard extends LightningElement {
    @api task;

    connectedCallback()
    {
        // console.log(this.task);        
    }
}