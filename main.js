async function tts(text,_lang, options = {}) {
    const { config, utils } = options;
    const { http } = utils;
    const { fetch, Body } = http;

    let {requestPath} = config;

    if (!requestPath) {
        requestPath = "http://localhost:8000/tts";
    }
    // 如果 requestPath 没有指定协议，默认添加 https 前缀
    if (!requestPath.startsWith('http')) {
        requestPath = 'https://' + requestPath;
    }

    // 如果 requestPath 不以 `/tts` 结尾，追加路径
    if (!requestPath.endsWith('/tts')) {
        requestPath += '/tts';
    }

    // 发送 POST 请求
    const res = await fetch(requestPath, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: Body.json(
            {
                'text':text,
                'output_path':"out.wav",
                'seed': 200
            }
        )
    });
    console.log(text);
    if (res.ok) {
        // const result = await res.arrayBuffer();
        // const result = res.data || res.body;
        let result = res.data;
        if (result) {
            return result;
        } else {
            throw JSON.stringify(result);
        }
    } else {
        throw `Http Request Error\nHttp Status: ${res.status}\n${JSON.stringify(res.data)}`;
    }
}
