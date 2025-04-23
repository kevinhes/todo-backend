function errorHandle ( response, headers ) {
  response.writeHead(400, headers)
  response.write(JSON.stringify(
    {
      status: 'success',
      message: '欄位未填寫完整或是 todo id 不存在',
    }
  ));
}

module.exports = errorHandle