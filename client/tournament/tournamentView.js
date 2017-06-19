/*
    ClassName:  ProgressBar
    Purpose:    To show graphical representation of completed matches
*/

class ProgressBar {
    //Instantiates the ProgressBar class
    constructor(selector, length) {
        this.body = selector;
        this.status = null;
        this.progress = null;

        this.position = -1;
        this.length = length;
    }

    //initializes the class parameters
    init() {
        let progress = document.createElement("span");
        progress.className = 'progress';
        this.progress = progress;
        this.body.appendChild(progress);
        
        this.render();
    }

    // multiple increments of blocks
    updateMultiple(increment) {
        this.position += increment;
        this.render();
    }

    // single increment of a block
    update() {
        this.position += 1;
        this.render();
    }

    // rendering the progress state on dom element
    render() {
        let blocks = "";
        for (let i = 0; i < this.length; i++) {
            if (i <= this.position) {
                blocks += "■ ";
            } else {
                blocks += "□ ";
            }
        }
        this.progress.textContent = blocks;
    }

    // removes the progress bar
    remove() {
        this.body.innerHTML=""; 
    }
}