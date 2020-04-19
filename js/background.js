var maps = new HashMap();
$(function() {
    /**
     * 加载所有数据
     */
    getAll(res => {
        var userIds = res.userIds;
        if (userIds != undefined && userIds != null) {
            for (var i = 0; i < userIds.length; i++) {
                maps.put(userIds[i], true);
            }
        }
    })
})

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener((req, sender, res) => {
    if (req != undefined && req != null && req) {
        if (req.cmd == 'check') {   //检查当前用户信息
            var checkList = req.userIds;
            for (var i = 0; i < checkList.length; i++) {
                if (maps.containsKey(checkList[i])) {
                    show(checkList[i]);
                    break;
                }
            }
        }
    }
});

/**
 * 根据当前map刷新数据
 */
function refresh() {
    var keySet = maps.keySet();
    //更新本地数据
    save(keySet);
}

/**
 * 添加一个用户的Id
 */
function addUser(userId) {
    maps.put(userId, true);
    refresh();
}

/**
 * 移除一个用户
 */
function removeOne(userId) {
    if (maps.containsKey(userId)) {
        maps.remove(userId);
        refresh();
    }
}

/**
 * 弹出提示框
 */
function show(id) {
    chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'img/icon.png',
        title: '出现黑名单队友',
        message: 'UID[' + id + ']是被你拉黑的人'
    });
}

/**
 * 清理Id
 */
function clear(callback) {
    chrome.storage.local.remove('userIds', callback);
}

function getAll(callback) {
    chrome.storage.local.get('userIds', callback);
}

/**
 * 
 */
function save(userIds) {
    clear(() => {
        chrome.storage.local.set({userIds: userIds}, () => {
            /*  */
        })
    });
}

/**
 * hashMap
 */
function HashMap(){  
    //定义长度  
    var length = 0;  
    //创建一个对象  
    var obj = new Object();  
  
    /** 
    * 判断Map是否为空 
    */  
    this.isEmpty = function(){  
        return length == 0;  
    };  
  
    /** 
    * 判断对象中是否包含给定Key 
    */  
    this.containsKey=function(key){  
        return (key in obj);  
    };  
  
    /** 
    * 判断对象中是否包含给定的Value 
    */  
    this.containsValue=function(value){  
        for(var key in obj){  
            if(obj[key] == value){  
                return true;  
            }  
        }  
        return false;  
    };  
  
    /** 
    *向map中添加数据 
    */  
    this.put=function(key,value){  
        if(!this.containsKey(key)){  
            length++;  
        }  
        obj[key] = value;  
    };  
  
    /** 
    * 根据给定的Key获得Value 
    */  
    this.get=function(key){  
        return this.containsKey(key)?obj[key]:null;  
    };  
  
    /** 
    * 根据给定的Key删除一个值 
    */  
    this.remove=function(key){  
        if(this.containsKey(key)&&(delete obj[key])){  
            length--;  
        }  
    };  
  
    /** 
    * 获得Map中的所有Value 
    */  
    this.values=function(){  
        var _values= new Array();  
        for(var key in obj){  
            _values.push(obj[key]);  
        }  
        return _values;  
    };  
  
    /** 
    * 获得Map中的所有Key 
    */  
    this.keySet=function(){  
        var _keys = [];  
        for(var key in obj){  
            _keys.push(key);  
        }  
        return _keys;  
    };  
  
    /** 
    * 获得Map的长度 
    */  
    this.size = function(){  
        return length;  
    };  
  
    /** 
    * 清空Map 
    */  
    this.clear = function(){  
        length = 0;  
        obj = new Object();  
    };  
}