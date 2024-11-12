const mysql = require('../mysql');

const isExist = (value, user_id, negative) => {
    return new Promise((resolve, reject) => {
      mysql('class').select('*')
      .where({value, user_id, negative})
      .orWhere({value, user_id:0})
      .then((result)=>{
        if (result.length){
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

const getClassList = (req, res) => {
  let negative = req.query.negative
  let user_id = req.query.user_id

    mysql('class').select('*').whereIn('user_id', [0, user_id]).andWhere({negative})
    .then((result)=>{
      res.send(result)
    }).catch((err) => {
      console.error(err)
    })
}

const addClass = (req, res) => {
  let value = req.body.value
  let user_id = req.body.user_id
  let negative = req.body.negative

  isExist(value, user_id, negative).then(exist => {
    if (!exist){
      mysql('class').insert({user_id, value, negative})
      .then((result)=>{
        res.send('ok')
      }).catch((err) => {
        console.error(err)
      })
    } else {
      res.send('existed')
    }
  }).catch((err) => {
    console.error(err)
  })
}

const putClass = (req, res) => {
  let id = req.body.id
  let value = req.body.value
  let user_id = req.body.user_id
  let negative = req.body.negative

  console.log(req.body)

  isExist(value, user_id, negative).then(exist => {
    if (!exist){
      mysql('class').where({id}).update({value})
      .then((result)=>{
        res.send('ok')
      }).catch((err) => {
        console.error(err)
      })
    } else {
      res.send('existed')
    }
  }) 
}

// 底下label都要刪掉
const deleteClass = (req, res) => {
  let id = req.body.id

  mysql('label')
  .where({class:id})
  .del()
  .then((result)=>{
    res.send('ok')
  })

  mysql('class')
  .where({id})
  .del()
  .then((result)=>{
    res.send('ok')
  })
}


module.exports = {
    getClassList,
    addClass,
    putClass,
    deleteClass,
}