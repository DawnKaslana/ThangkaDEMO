const fs = require('fs')
const path = require('path')
var multiparty = require('multiparty');


const getFile = (req, res) => {
        var filename = req.query.filename
        var filePath = path.resolve(__dirname, '../file/'+filename)
        
        fs.readFile(filePath, (err, data) => {
                if (err) throw err;
                res.send(data);
        })
}

const putFile = (req, res) => {
        var form = new multiparty.Form();
        // path.resolve 很重要
        form.uploadDir = path.resolve(__dirname, '../file')

        form.parse(req, function (err, fields, files){
                let fileName = files.file[0].path.split('/')[3]
                var filesTmp = JSON.stringify(files, null, 2)
                if (err) {
                        // 保存失败 
                        //console.log('Parse error: ' + err);
                        res.send({'msg':err});
                    } else {
                        // 图片保存成功！
                        //console.log(files.file[0])
                        res.send({'msg':'保存完畢', 'videoName':fileName});
                    }
        })
        
        
}

module.exports = {
        getFile,
        putFile,
}