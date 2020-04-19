$(function(){
	loadUserList();
});

/*
 * 加载页面中的用户列表
 */
function loadUserList() {
	//加载用户列表命令
	chrome.storage.local.get({userIds:[]}, result => {
        var blackIds = result.userIds;
        if (blackIds.length == 0) {
            $('.box>ul').append('<li>没有黑名单</li>')
        } else {
            for (var i = 0; i < blackIds.length; i++) {
                addRows(blackIds[i]);
            }
        }
    });
}

/**
 * 对table添加行
 */
function addRows(userId) {
	$('.box>ul').append('<li><a href="#">移除</a>|' + userId + '</li>')
}

//事件代理
$('.box ul').on('click', 'li', function(){
    var userStr = $(this).text();
    if (userStr == '没有黑名单') {
        return;
    }
    var userId = userStr.split("|")[1];
	var check = confirm('你确定要移除:' + userId + "吗?");
	if (check) {
		var bg = chrome.extension.getBackgroundPage();
		//拉黑用户
		bg.removeOne(userId);
        alert('已移除');
        $(this).remove();
    }
})