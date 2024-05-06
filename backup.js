const express = require('express')
const app = express()
const port = 3001

const token = '$2y$10$bqBmVWnLueHlcyuDbeFmWuZXZs.D6Hy8IdTDQCFHAbqmvCkk9gLJu'

const myLogger = function (req, res, next) {
  console.log('LOGGED')
  next()
}

app.use(myLogger)

app.get('/posts/:id', (req, res) => {
  const fetchNewsFeed = async () => {
    const response = await fetch(`http://192.168.4.200:81/social_media_api/home/post.php?user_id=${req.params.id}`, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    if(response.ok){
        const data = await response.json();
        res.send(data)
    }
  }

  fetchNewsFeed()
  //res.send('Hello Worlds!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})