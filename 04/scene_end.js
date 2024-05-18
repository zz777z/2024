var SceneEnd = function (game) {
    var s = {
        game: game,
    }
    // 初始化
    s.draw = function () {
        game.context.fillText('游戏结束', 100, 290)
    }
    s.update = function () {
    }
    return s
}