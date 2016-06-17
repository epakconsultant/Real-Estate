YaFilter = {

    'clean': function (options) {

        var source,
            type,
            matches,
            result;

        options = options || {};
        source = options.source.toString() || '';
        type = options.type.toString().toUpperCase()  || 'string';

        result = null;

        switch (type) {
            case 'INT':
            case 'INTEGER':
                // Only use the first integer value
                matches = source.match(/-?[0-9]+/g);

                if (matches !== null) {

                    result = parseInt(matches[0], 10);
                } else {
                    result = 0;
                }
                break;

            case 'NUMBER':
                // All digits
                result =  parseInt(source.replace(/[^0-9]/ig, ''), 10);
                break;

            case 'FLOAT':
            case 'DOUBLE':
                // Only use the first floating point value
                matches = source.match(/-?[0-9]+(\.[0-9]+)?/g);

                if (matches !== null) {
                    result = parseFloat(matches[0]);
                } else {
                    result = 0;
                }

                break;

            case 'BOOL':
            case 'BOOLEAN':
                if (source === 'true' || source === true) {
                    result = true;
                } else {
                    result = false;
                }
                break;

            case 'WORD':
                result = source.replace(/[^A-Z_]/ig, '');
                break;

            case 'WORDNUMS':
                result = source.replace(/[^A-Z0-9_-]/ig, '');
                break;

            case 'HTML':
                result = UniHTML.purify(source);
                break;

            case 'IMG':

                source = source.toLowerCase();
                matches = source.match(/^([a-z0-9_-])+\.(jpg|jpeg|png|gif)$/ig);

                if (matches !== null) {
                    result = matches[0].toString();
                } else {
                    result = '';
                }
                break;

            case 'ALNUM':
                result = source.replace(/[^A-Z0-9]/ig, '');
                break;

            case 'CMD':
                result = source.replace(/[^A-ZА-Я0-9_-]/ig, '');
                break;

            case 'STRING':
                result = source.replace(/[^A-ZА-Я0-9\/_.!?,:; +-]/ig, '');
                break;

            case 'STRINGURL':
                result = source.replace(/[^A-ZА-Я0-9_.!?, -=]/ig, '');
                break;

            case 'MAIL':
                source = source.toLowerCase();
                matches = source.match(/^[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9.-]+$/g);

                if (matches !== null) {
                    result = matches[0].toString();
                } else {
                    result = '';
                }
                break;

            case 'USERNAME':
                result = source.replace(/[^A-Z0-9]/ig, '');
                break;

            default:

            	if (_.isArray(source)) {

                    _.each(source, function (element, index, array) {

                        result = source.replace(/[^A-Z0-9]/ig, '');
                    });

                    result = source;
                } else {
                    // Default AlNum
                    result = source.replace(/[^A-Z0-9]/ig, '');
                }
                break;
        }

        return result;
    }
};
