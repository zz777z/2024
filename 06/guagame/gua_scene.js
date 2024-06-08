class GuaScene {
    constructor(game) {
        this.game = game
        this.element = []
    }
    static new(game) {
        var i = new this(game)
        return i
    }
    addElement(img) {
        this.element.push(img)
    }
    draw() {
        for (var i = 0; i < this.element.length; i++) {
            var e = this.element[i]
            this.game.drawImage(e)
        }
    }
    update() {

    }
}






