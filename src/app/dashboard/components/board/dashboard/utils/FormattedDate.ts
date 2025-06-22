export class FormattedDate {
    now: Date;
    constructor() {
        this.now = new Date();
    }
    public getId() {
        const pad = (n: number) => n.toString().padStart(2, '0');
        const year = this.now.getFullYear();
        const month = pad(this.now.getMonth() + 1);
        const day = pad(this.now.getDay());
        const hours = pad(this.now.getHours());
        const minutes = pad(this.now.getMinutes());
        const seconds = pad(this.now.getSeconds());
        return `${year+month+day+hours+minutes+seconds}`;
    }

}