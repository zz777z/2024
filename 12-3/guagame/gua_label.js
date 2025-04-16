class GuaLabel {
    constructor(game, text) {
        this.game = game
        this.text = text
    }
    static new(game, text) {
        return new this(game, text)
    }
    draw() {
        // log('draw lable', this.game, this.text)
        this.game.context.fillText(this.text, 100, 290)
    }
    update() {
    }
}