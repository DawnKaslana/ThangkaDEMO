const mysql = require('../mysql');

const getClassList = (req, res) => {
    mysql('class').select('*')
    .then((result)=>{
      res.send(result)
    }).catch((err) => {
      console.error(err)
    })
}

const getLabelList = (req, res) => {
    let resList = [[]]
    let rowId = 0
    mysql('label').select('*')
    .then((result)=>{
        let count = 0;
        result.forEach(elem => {
            resList[rowId].push(elem)
            count += 1
            if (count % 6 === 0) {rowId+=1;resList.push([])}
        });
      res.send(resList)
    }).catch((err) => {
      console.error(err)
    })
}

module.exports = {
    getClassList,
    getLabelList,
}