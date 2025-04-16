class Pipes {
    constructor(game) {
        this.game = game
        this.pipes = []
        this.pipeSpace = 150
        this.管子横向间距 = 200
        this.columsOfpipe = 3
        this.score = 0
        this.birdX = 0
        this.newBird = ''
        this.dataObj = {
            0: {
                status: true,
                value: 0,
            },
            1: {
                status: true,
                value: 0,
            },
            2: {
                status: true,
                value: 0,
            },
        }
        this.progress = false
        for(var i = 0; i < this.columsOfpipe; i++) {
            var p1 = GuaImage.new(game, 'pipe')
            p1.flipY = true
            p1.x = 500 + i * this.管子横向间距
            var p2 = GuaImage.new(game, 'pipe')
            p2.x = p1.x
            this.resetPipesPosition(p1, p2)
            this.pipes.push(p1)
            this.pipes.push(p2)
        }
    }
    static new(game) {
        return new this(game)
    }
    resetPipesPosition(p1, p2) {
        p1.y = randomBetween(-200, 0)
        p2.y = p1.y + p1.h + this.pipeSpace
    }
    debug() {
        this.管子横向间距 = config.管子横向间距.value
        this.pipeSpace = config.pipe_space.value
        //    edbugger
    }
    update() {
        for (var i = 0; i < this.pipes.length / 2; i++) {
            var p1 = this.pipes[i * 2]
            var p2 = this.pipes[i * 2 + 1]
            p1.x -= 5
            p2.x -= 5
            this.dataObj[i].value = p1.x + p1.w
            this.progress = this.collide(this.newBird, p1, p2)
            if (this.progress) {
                // 结束游戏
                var end = SceneEnd.new(this.game)
                this.game.replaceScene(end)
                this.progress = false
                return
            }
            if (this.dataObj[i].status && this.birdX > this.dataObj[i].value) {
                this.score += 1
                this.dataObj[i].status = false
            }
            if(p1.x < -100) {
                p1.x += this.管子横向间距 * this.columsOfpipe
                this.dataObj[i].status = true
            }
            if(p2.x < -100) {
                p2.x += this.管子横向间距 * this.columsOfpipe
                this.resetPipesPosition(p1, p2)
            }

        }
    }
    aInb(x, x1, x2) {
        return x >= x1 && x <= x2
    }
    collide(bird, pipe1, pipe2) {
        var b = bird
        var p1 = pipe1
        var p2 = pipe2
        if (this.aInb(b.x, p1.x, p1.x + p1.w) || this.aInb(p1.x, b.x, b.x + b.w)) {
            if (this.aInb(b.y, p1.y, p1.y + p1.h) || this.aInb(p1.y, b.y, b.y + b.h)) {
                return true
            }
        }
        if (this.aInb(b.x, p2.x, p2.x + p2.w) || this.aInb(p2.x, b.x, b.x + b.w)) {
            if (this.aInb(b.y, p2.y, p2.y + p2.h) || this.aInb(p2.y, b.y, b.y + b.h)) {
                return true
            }
        }
        return false
    }
    draw() {
        var context = this.game.context
        for (var p of this.pipes) {
            context.save()
            var w2 = p.w / 2
            var h2 = p.h / 2
            context.translate(p.x + w2, p.y + h2)
            var scaleX = p.flipX ? -1 : 1
            var scaleY = p.flipY ? -1 : 1
            context.scale(scaleX, scaleY)
            context.rotate(p.rotation * Math.PI / 180)
            context.translate(-w2, -h2)
            context.drawImage(p.texture, 0, 0)
            context.restore()
        }
        this.game.context.fillText(`当前通过柱子数：` + this.score, 10, 30)
    }
    updateX(b) {
        this.birdX = b.x
        this.newBird = b
    }
}

class SceneTitle extends GuaScene {
    constructor(game) {
        super(game);
        // var label = GuaLabel.new(game, 'hello form gua')
        // this.addElement(label)

        // bg
        var bg = GuaImage.new(game, 'bg')
        this.addElement(bg)
        // 加入水管
        this.pipe = Pipes.new(game)
        this.addElement(this.pipe)
        // 循环移动的地面
        this.grounds = []
        for (var i = 0; i < 30; i++) {
            var g = GuaImage.new(game, 'ground')
            g.x = i * 22
            g.y = 550
            this.addElement(g)
            this.grounds.push(g)
        }
        this.skipCount = 4
        // bird
        this.birdSpeed = 2
        var b = GuaAnimation.new(game)
        b.x = 150
        b.y = 200
        this.bird = b
        this.addElement(b)
        this.setupInputs()
    }
    debug() {
        this.birdSpeed = config.bird_speed.value
    }
    update() {
        this.birdSpeed = config.bird_speed.value
        super.update()
        //    地面移动
        this.skipCount--
        var offset = -5
        if (this.skipCount == 0) {
            this.skipCount = 4
            offset = 15
        }
        for (var i = 0; i < 30; i++) {
            var g = this.grounds[i]
            g.x += offset
        }
        this.pipe.updateX(this.bird)
    }
    setupInputs() {
        var self = this
        var b = this.bird
        self.game.registerAction('a', function (keyStatus){
            b.move(-self.birdSpeed, keyStatus)
        })
        self.game.registerAction('d', function (keyStatus){
            b.move(self.birdSpeed, keyStatus)
        })
        self.game.registerAction('j', function (keyStatus){
            b.jump()
        })
    }
}
