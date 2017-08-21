var show = false;
module.exports = {
    toggleDialog() {
        show = !show;
        this.setData({
            "Dialog.showDialog": show
        });
    },
    inputChange(event) {
        this.setData({
            "Dialog.value": event.detail.value
        });
    }
}