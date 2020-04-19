$(function(){
	loadUserList();
});

// 获取当前选项卡ID
function getCurrentTabId(callback)
{
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
	{
		if(callback) callback(tabs.length ? tabs[0].id: null);
	});
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback)
{
	getCurrentTabId((tabId) =>
	{
		chrome.tabs.sendMessage(tabId, message, function(response)
		{
			if(callback) {
				callback(response);
			}
		});
	});
}

/**
 * 加载页面中的用户列表
 */
function loadUserList() {
	chrome.tabs.getSelected(null, function (tab) {
		var url = tab.url;
		var pattern = "http://game.granbluefantasy.jp";
		if (url != undefined && url.indexOf(pattern) != -1) {
			//只有在gbf下才会发送信息
			//加载用户列表命令
			var message = {
				cmd:"load_user_list"
			}
			sendMessageToContentScript(message, res => {
				if (res != undefined && res != null) {
					//加载页面table
					if (res.status == 0) {
						var list = res.data;
						for (var i = 0; i < list.length; i++) {
							addRows(list[i]);
						}
					}
				}
			})
		}
    });
}

/**
 * 对table添加行
 */
function addRows(user) {
	var str = user.name + "[" + user.id + "]";
	$('.box>ul').append('<li><a href="#">' + str + '</a></li>')
}

//事件代理
$('.box ul').on('click', 'li', function(){
	var userStr = $(this).text();
	var user = userStr.split("[");
	var check = confirm('你确定要拉黑:' + user[0] + "吗?");
	if (check) {
		var bg = chrome.extension.getBackgroundPage();
		//拉黑用户
		bg.addUser(user[1].split("]")[0]);
		alert('已拉黑');
	}
})


$('#showBlack').click(() => {
	chrome.tabs.create({url: 'html/list.html'});
})