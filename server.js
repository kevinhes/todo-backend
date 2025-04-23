const http = require('http');
const errorHandle = require('./errorhandle');
const { v4: uuidv4 } = require('uuid');
const todosList = []

const requestListener = (request, response) => {
  const { url, method } = request
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    // 允許取用的方式
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    // 回傳的資料格式
    'Content-Type': 'application/json'
  }
  let body = ''
  request.on('data', chunk => {
    body += chunk
  })
  if ( url === '/todo' && method === 'GET') {
    response.writeHead(200, headers)
    response.write(
      JSON.stringify(
        {
          status: 'success',
          message: 'Get Todo List',
          data: todosList
        }
      )
    )
    response.end()
  } else if ( url === '/todo' && method === 'POST') {
    request.on('end', () => {
      try {
        const { title } = JSON.parse(body)
        if ( title !== undefined ) {
          const todo = {
            title,
            id:uuidv4()
          }
          todosList.push(todo)
          response.writeHead(200, headers)
          response.write(
            JSON.stringify(
              {
                status: 'success',
                message: 'Create Todo',
                data: todosList
              }
            )
          )
        } else {
          errorHandle(response, headers)
        }
      } catch (error) {
        errorHandle(response, headers)
      } finally {
        response.end()
      }
      
    })
  } else if ( url === '/todo' && method === 'DELETE') {
    todosList.length = 0
    response.writeHead(200, headers)
    response.write(
      JSON.stringify(
        {
          status: 'success',
          message: '全部清除',
          data: todosList
        }
      )
    )
    response.end()
  } else if( url.startsWith('/todo/') && method === 'DELETE' ) {
    const id = url.split('/').pop()
    const index = todosList.findIndex(todo => todo.id === id)
    if ( index !== -1 ) {
      todosList.splice(index, 1)
      response.writeHead(200, headers)
      response.write(
        JSON.stringify(
          {
            status: 'success',
            message: '刪除成功',
            data: todosList
          }
        )
      )
    } else {
      errorHandle(response, headers)
    }
    response.end()
  } else if( url.startsWith('/todo/') && method === 'PATCH' ) {
    request.on('end', () => {
      try {
        const id = url.split('/').pop()
        const { title } = JSON.parse(body)
        const index = todosList.findIndex(todo => todo.id === id)
        if ( index !== -1 && title !== undefined) {
          todosList[index].title = title
          response.writeHead(200, headers)
          response.write(
            JSON.stringify(
              {
                status: 'success',
                message: '更新成功',
                data: todosList
              }
            )
          )
        } else {
          errorHandle(response, headers)
        }
      } catch (error) {
        errorHandle(response, headers)
      } finally {
        response.end()
      }
    })
  } else if ( url === '/todo' && method === 'OPTIONS') {
    response.writeHead(200, headers)
    response.end()
  } else {
    response.writeHead(404, headers)
    response.write(
      JSON.stringify(
        {
          message: 'Not Found'
        }
      )
    )
    response.end()
  }
}

const server = http.createServer(requestListener);
server.listen( process.env.PORT || 3005, () => {
    console.log('Server is running on port 3005');
})