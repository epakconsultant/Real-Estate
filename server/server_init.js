Meteor.startup(function () {

  UploadServer.init({

    'tmpDir': process.env.PWD + '/.uploads/tmp',
    'uploadDir': process.env.PWD + '/.uploads/',
    'checkCreateDirectories': true,
    /*'validateRequest': function (request) {

    	console.log(request);

    	return true;
    },*/
    /*'validateFile': function(fileInfo) {

    	console.log(fileInfo);
    	return true;
    },*/
    /*'maxPostSize': 1100000000,
    'maxFileSize': 1000000000,
    'minFileSize': 1,*/
    'overwrite': false,
    'getDirectory': function (fileInfo, formData) {

      // create a sub-directory in the uploadDir based on the content type (e.g. 'images')
      return formData.id;
    },
    'getFileName': function (fileInfo, formData) {

        var newFileNameArr = fileInfo.name.split('.');

        if (newFileNameArr.length && newFileNameArr.length > 1) {

            var newFileName = YaFilter.clean({
                'source': s(Meteor.uuid()).trim().value(),
                'type': 'AlNum'
            }) + '.' + newFileNameArr[newFileNameArr.length-1];

            return newFileName;
        }

        return fileInfo.name.toLowerCase();
    },
    'acceptFileTypes': /.(gif|jpe?g|png)$/i,
    'imageVersions': {
    	'bigImage': {
    		'width': 1200,
    		'height': 800
    	},
    	'thumbImage' : {
    		'width': 300,
    		'height': 200
    	}
    },
    mimeTypes: {
	    "jpeg": "image/jpeg",
	    "jpg": "image/jpeg",
	    "png": "image/png",
	    "gif": "image/gif"
	}
  });
});
