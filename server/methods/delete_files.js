Meteor.methods({

    // ToDo - check for rights, check for estateobjectID and image match
    'deleteImg': function (folderName, fileName) {

        folderName = YaFilter.clean({
            'source': s(folderName).trim().value(),
            'type': 'Alnum'
        });

        var fileNameArr = fileName.split('.');

        if (!fileNameArr.length || fileNameArr.length !== 2) {

            throw new Meteor.Error('Error', 'Ошибка при удалении изображения.');
        }

        var ext = YaFilter.clean({
            'source': s(fileNameArr[1].toLowerCase()).trim().value(),
            'type': 'Alnum'
        });

        if (_.indexOf(['jpg', 'jpeg', 'png', 'gif'], ext)) {

            throw new Meteor.Error('Error', 'Ошибка при удалении изображения.');
        }

        fileName = YaFilter.clean({
            'source': s(fileNameArr[0]).trim().value(),
            'type': 'Alnum'
        }) + '.' + YaFilter.clean({
            'source': s(fileNameArr[1]).trim().value(),
            'type': 'Alnum'
        })

        check(folderName, String);
        check(fileName, String);

        var fs = Npm.require('fs');

        var rmDir = function (dirPath) {

            try {

                var files = fs.readdirSync(dirPath);
            } catch(e) {

                throw new Meteor.Error('Error', 'Ошибка при удалении изображения.');
            }

            if (files.length > 0) {

                for (var i = 0; i < files.length; i++) {



                    var filePath = dirPath + '/' + files[i];

                    if (fs.statSync(filePath).isFile()) {

                        if (files[i] === fileName) {

                            fs.unlinkSync(filePath);
                        }
                    }
                    else {

                        rmDir(filePath);
                    }
                }
            }
        };

        rmDir(process.env.PWD + '/.uploads/' + folderName);

        return {
            'status': 'note',
            'message': 'Изображение удалено'
        }
    }
});
