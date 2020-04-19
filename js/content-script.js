//页面监听popup发送过来的消息
chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req && req != undefined && req != null) {
        if (req.cmd == 'load_user_list') {
            //加载用户列表
            var userList = readRoom(readRaid());
            res({
                status: 0,
                data: userList
            });
        }
    }
});

function readRaid() {
    var result = [];
    var pops = $('.pop-alliance-window');
    if (pops == undefined) {
        return result;
    }
    var popsChildren = pops.children("div");
    var result = [];
    for (var i = 0; i < popsChildren.length; i++) {
        var rows = popsChildren[i];
        var id = rows.getAttribute("data-id");

        var nodes = rows.childNodes;
        var name = nodes[3].innerHTML;
        result.push({
            name:name,
            id:id
        });
    }
    return result;
}

function readRoom(result) {
    var pops = $('.prt-room-member');
    if (pops == undefined) {
        return result;
    }
    var popsChildren = pops.children("div");
    for (var i = 0; i < popsChildren.length; i++) {
        var rows = popsChildren[i];
        var id = rows.getAttribute("data-user-id");
        var name = rows.getAttribute("data-nick-name");
        result.push({
            name:name,
            id:id
        });
    }
    return result;
}

/**
 * raid查看玩家
 */
$('body').on('click', '.btn-alliance', () => {
    var pops = $('.pop-alliance-window');
    var popsChildren = pops.children("div");
    var result = [];
    for (var i = 0; i < popsChildren.length; i++) {
        var rows = popsChildren[i];
        var id = rows.getAttribute("data-id");
        result.push(id);
    }
    sendMessageToBackground(result);
})

/**
 * 共斗查看玩家
 */
$('body').on('click', '.btn-member', () => {
    setTimeout(() => {
        var pops = $('.prt-room-member');
        var popsChildren = pops.children("div");
        var result = [];
        for (var i = 0; i < popsChildren.length; i++) {
            var rows = popsChildren[i];
            var id = rows.getAttribute("data-user-id");
            result.push(id);
        }
        sendMessageToBackground(result);
    }, 1500);
})

/**
 * 发送给后台信息
 * @param {发送给后台信息}} message 
 */
function sendMessageToBackground(userIds) {
	chrome.runtime.sendMessage({cmd:'check', userIds:userIds});
}