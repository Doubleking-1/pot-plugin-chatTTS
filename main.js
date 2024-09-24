async function tts(text, requestPath, outputFile = "out.wav") {
    /**
     * 将文本转换为音频文件，并返回该 .wav 文件的二进制内容。
     * 
     * 参数:
     * - text: 要转换为语音的文本。
     * - requestPath: TTS 服务的 URL 请求路径。
     * - outputFile: 保存输出音频文件的路径，默认为 'out.wav'。
     *
     * 返回:
     * - 成功时返回 .wav 文件的二进制数据。
     */

    // 如果 requestPath 没有指定协议，默认添加 https 前缀
    if (!requestPath.startsWith('http')) {
        requestPath = 'https://' + requestPath;
    }

    // 如果 requestPath 不以 `/tts` 结尾，追加路径
    if (!requestPath.endsWith('/tts')) {
        requestPath += '/tts';
    }

    // 定义请求体
    const data = {
        "text": text,              // 输入的文本
        "output_path": outputFile   // 输出音频文件路径
    };

    // 发送 POST 请求
    const response = await fetch(requestPath, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        // 获取响应的音频二进制内容
        const audioContent = await response.arrayBuffer();

        // 使用 Node.js 环境或 Electron 环境保存音频文件
        const fs = require('fs');
        fs.writeFileSync(outputFile, Buffer.from(audioContent));

        // 返回音频文件的二进制内容
        return audioContent;
    } else {
        // 处理错误，抛出异常
        const errorText = await response.text();
        throw new Error(`Http Request Error\nHttp Status: ${response.status}\n${errorText}`);
    }
}
