document.addEventListener('DOMContentLoaded', function() {
    var now = new Date();
    var dateTimeStr = now.toLocaleString();
    var chatboxelement = document.getElementById("chatbox");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:8081/HM", true);
    xhr.send();
    xhr.onreadystatechange = function () {
        chatboxelement = document.getElementById("chatbox");
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log(response);
                if (response.code === 200) {
                    for (var i = 0;i < response.content.length;i++) {
                        if (response.content[i].role === "user") {
                            chatboxelement.innerHTML += `<div class="message my_message">
                            <p>${escapeHtml(response.content[i].content)}<br><span>${response.content[i].datetime}</span></p>
                            </div>`;
                        } else if (response.content[i].role === "assistant") {
                            chatboxelement.innerHTML += `<div class="message frnd_message">
                            <p>${escapeHtml(response.content[i].content)}<br><span>${response.content[i].datetime}</span></p>
                            </div>`;
                        }
                    }
                } else if (response.code === 500) {
                    chatboxelement.innerHTML += `<div class="message frnd_message">
                    <p>获取历史会话消息失败，错误代码：${response.code}<br><span>${dateTimeStr}</span></p>
                    </div>`;
                }
            } else {
                // 请求失败，处理错误
                chatboxelement.innerHTML += `<div class="message frnd_message">
                <p>请求失败，错误代码：${xhr.status}<br><span>${dateTimeStr}</span></p>
                </div>`;
            }
            document.getElementById('bottom').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    };
});

function a() {
    var now = new Date();
    var dateTimeStr = now.toLocaleString();
    var inputElement = document.getElementById("myInput");
    if (inputElement.value === ""){
        alert("不能发送空消息！");
        return;
    }
    var inputValue = encodeURIComponent(inputElement.value);
    var chatboxelement = document.getElementById("chatbox");
    chatboxelement.innerHTML += `<div class="message my_message">
    <p>${escapeHtml(inputElement.value)}<br><span>${dateTimeStr}</span></p>
    </div>
    <div class="message frnd_message">
    <p>正在处理中...<br><span>${dateTimeStr}</span></p>
    </div>`;
    inputElement.value = "";
    document.getElementById('bottom').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    // 创建一个新的XMLHttpRequest对象
    var xhr = new XMLHttpRequest();
    // 设置请求的方法和URL
    xhr.open("GET", "http://127.0.0.1:8081/GPT?question=" + inputValue, true);
    // 发送请求
    xhr.send();
    // 监听请求完成的事件
    xhr.onreadystatechange = function () {
        chatboxelement = document.getElementById("chatbox");
        if (xhr.readyState === 4) {
            // 请求完成
            var now = new Date();
            var dateTimeStr = now.toLocaleString();
            if (xhr.status === 200) {
                // 请求成功，处理响应数据
                var response = JSON.parse(xhr.responseText);
                if (response.code === 200) {
                    chatboxelement.innerHTML += `<div class="message frnd_message">
                    <p>${escapeHtml(response.content)}<br><span>${dateTimeStr}</span></p>
                    </div>`;
                } else {
                    // 请求失败，处理错误
                    chatboxelement.innerHTML += `<div class="message frnd_message">
                    <p>请求失败，错误代码：${response.code}<br><span>${dateTimeStr}</span></p>
                    </div>`;
                }
            } else {
                // 请求失败，处理错误
                chatboxelement.innerHTML += `<div class="message frnd_message">
                <p>请求失败，错误代码：${xhr.status}<br><span>${dateTimeStr}</span></p>
                </div>`;
            }
            document.getElementById('bottom').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    };
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        a();
        var inputElement = document.getElementById("myInput");
        inputElement.value = "";
    }
});

function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function(match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match];
    });
}