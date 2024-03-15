import json
import os
import openai
from flask import Flask, make_response, request
from flask_cors import CORS
from flask_cors import cross_origin
from urllib.parse import unquote
import pygetwindow as gw
import threading
from datetime import datetime
import webbrowser

openai.api_key = input("Your api-key:")

temp = input("Setting temperature(0-2):")
if temp == "":
    temp = 0.5
else:
    temp = float(temp)

prompts = input("Setting prompts:")
if prompts == "":
    prompts = "You are a helpful assistant."
else:
    prompts = str(prompts)

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.urandom(24)
lock = threading.Lock()

Allmessages = []
Times = []
ips = []

active_window = gw.getActiveWindow()
active_window.minimize()

try:
    file_path = 'Chat.html'
    file_url = 'file://' + os.path.abspath(file_path)
    webbrowser.open(file_url)
except Exception:
    print("Web page launch failed.")

@app.route("/GPT", methods=["GET"])
@cross_origin()
def GPT():
    try:
        global ips
        global Times
        global Allmessages
        question = request.args.get('question')
        question = unquote(question)
        print(question)

        if request.remote_addr not in ips:
            with lock:
                ips.append(request.remote_addr)
                Allmessages.append([{"role": "system", "content": prompts}])
                Times.append([datetime.now().strftime("%Y/%m/%d %H:%M:%S")])

        index = ips.index(request.remote_addr)
        with lock:
            Allmessages[index].append({"role": "user", "content": question})
            Times[index].append(datetime.now().strftime("%Y/%m/%d %H:%M:%S"))
        completion = openai.ChatCompletion.create(
        model = "gpt-3.5-turbo",
        temperature = temp,
        messages = Allmessages[index]
        )
        completion.encoding = 'utf-8'
        print(completion.choices[0].message.content)
        with lock:
            Allmessages[index].append({"role": "assistant", "content": completion.choices[0].message.content})
            Times[index].append(datetime.now().strftime("%Y/%m/%d %H:%M:%S"))

        data =  {
                    "code": 200,
                    "message": "ok",
                    "content": completion.choices[0].message.content,
                }
        json_data = json.dumps(data)
        response = make_response(json_data)
        response.mimetype = "applcation/json"
        return response
    except Exception:
        data =  {
                    "code": 500,
                    "message": "unexpected error",
                    "content": None,
                }
        json_data = json.dumps(data)
        response = make_response(json_data)
        response.mimetype = "applcation/json"
        return response
    
@app.route("/HM", methods=["GET"])
@cross_origin()
def HM():
    try:
        global ips
        global Times
        global Allmessages

        if request.remote_addr not in ips:
            data =  {
                        "code": 201,
                        "message": "new user",
                        "content": [],
                    }
            json_data = json.dumps(data)
            response = make_response(json_data)
            response.mimetype = "applcation/json"
            return response

        index = ips.index(request.remote_addr)
        historymessages = []
        for i in range(1,len(Allmessages[index])):
            historymessages.append({"role": Allmessages[index][i]["role"], "content": Allmessages[index][i]["content"], "datetime": Times[index][i]})

        data =  {
                    "code": 200,
                    "message": "ok",
                    "content": historymessages,
                }
        json_data = json.dumps(data)
        response = make_response(json_data)
        response.mimetype = "applcation/json"
        return response
    except Exception:
        data =  {
                    "code": 500,
                    "message": "unexpected error",
                    "content": None,
                }
        json_data = json.dumps(data)
        response = make_response(json_data)
        response.mimetype = "applcation/json"
        return response
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8081)
