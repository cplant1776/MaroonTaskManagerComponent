import { LightningElement, api } from 'lwc';

export default class TaskList extends LightningElement {
    @api listName;
    @api taskList = [];
    @api taskListId

    connectedCallback()
    {
        // this.listName = "Bananas";
        // this.loadDummyData();
    }

    loadDummyData()
    {
        const taskList = [
            {
                description: "DESCRIPTION 1",
            },
            {
                description: "DESCRIPTION 2",
            },
            {
                description: "DESCRIPTION 3",
            },
            {
                description: "DESCRIPTION 4",
            }
        ]

        this.taskList = taskList;
    }
}