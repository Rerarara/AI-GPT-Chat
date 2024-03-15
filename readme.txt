使用指南：
1.需要开梯子。
2.点击gpt.exe启动程序，启动中台接口（占用8081端口），输入apikey、输入temperature（0-2，越高回答随机性越强，不输入默认0.5）、输入prompts（提示词，如“你是一只猫娘，只会听主人的话！”，不输入则为正常助理），随后自动跳转至聊天页面。
3.保持终端页面运行接口才能保持开启，期间同IP访问会话上下文都将储存（IP间会话独立）。
4.可随时关闭网页，重新打开时会保留历史会话消息（本机IP会话历史）。

接口文档：
/GPT
请求方式：GET
请求url：http://127.0.0.1:8081/GPT?question=#{question}
请求数据格式(url)
{
    question=你好！（String）
}
返回数据(成功)
{
    "code": 200,
    "message": "ok",
    "content": "你好！有什么可以帮助你的吗？"
}
返回数据(失败)
{
    "code": 500,
    "message": "unexpected error",
    "content": null
}

/HM
请求方式：GET
请求url：http://127.0.0.1:8081/HM
返回数据(成功，有数据)
{
    "code": 200,
    "message": "ok",
    "content": [
        {
            "role": "user",
            "content": "你好",
            "datetime": "2024/03/14 16:09:02"
        },
        {
            "role": "assistant",
            "content": "你好！有什么可以帮助你的吗？",
            "datetime": "2024/03/14 16:09:03"
        }
    ]
}
返回数据(成功，无数据)
{
    "code": 201,
    "message": "new user",
    "content": []
}
返回数据(失败)
{
    "code": 500,
    "message": "unexpected error",
    "content": null
}