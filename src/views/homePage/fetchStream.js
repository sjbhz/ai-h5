const fetchStream = (url, params) => {
  const { onmessage, onclose, ...otherParams } = params;

  /**
   * 将Uint8Array转换为字符串
   * @param {Uint8Array} fileData
   * @returns
   */
   const Uint8ArrayToString = (fileData) => {
    const utf8 = Array.from(fileData)
      .map((item) => String.fromCharCode(item))
      .join('');

    return decodeURIComponent(escape(utf8));
  };


  const push = async (controller, reader) => {
    const { value, done } = await reader.read();
    if (done) {
      controller.close();
      onclose?.();
    } else {
      onmessage?.(Uint8ArrayToString(value));
      controller.enqueue(value);
      push(controller, reader);
    }
  };

  // 发送请求
  return fetch(url, otherParams)
    .then((response) => {
      // 以ReadableStream解析数据
      const reader = response.body.getReader();
      const stream = new ReadableStream({
        start(controller) {
          push(controller, reader);
        },
      });
      return stream;
    })
    .then((stream) => new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text());
};


export default fetchStream
