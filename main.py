import aiohttp
import json

async def tts(text, requestPath, output_file="out.wav"):
    """
    将文本转换为音频文件，并返回该 .wav 文件的二进制内容。

    参数:
    - text: 要转换为语音的文本。
    - requestPath: TTS 服务的 URL 请求路径。
    - output_file: 保存输出音频文件的路径，默认为 'out.wav'。

    返回:
    - 成功时返回 .wav 文件的二进制数据。
    """
    # 如果 requestPath 没有指定协议，默认添加 https 前缀
    if not requestPath.startswith('http'):
        requestPath = 'https://' + requestPath

    # 如果 requestPath 不以 `/tts` 结尾，追加路径
    if not requestPath.endswith('/tts'):
        requestPath += '/tts'

    # 定义请求体
    data = {
        "text": text,               # 输入的文本
        "output_path": output_file   # 输出音频文件路径
    }

    # 发送异步 POST 请求
    async with aiohttp.ClientSession() as session:
        async with session.post(requestPath, headers={
            'Content-Type': 'application/json'
        }, data=json.dumps(data)) as response:

            if response.status == 200:
                # 获取响应的音频二进制内容
                audio_content = await response.read()

                # 将音频数据保存为指定的文件
                with open(output_file, "wb") as f:
                    f.write(audio_content)

                # 返回音频文件的二进制内容
                return audio_content
            else:
                # 处理错误，抛出异常
                error_message = f"Http Request Error\nHttp Status: {response.status}\n{await response.text()}"
                raise Exception(error_message)

