YaRequest = {

    'getVar': function (name, defaultVal, inputType, type) {

        var input,
            result;

        inputType = inputType || 'default';
        type = type || 'none';

        // Ensure inputType and type are uppercase
        inputType = inputType.toUpperCase();

        type = type.toUpperCase();

        // Get the input inputType
        switch (inputType)
        {
            case 'INPUT':
                input = $('#' + name).val();
                break;

            case 'SELECT':
                if ($('#' + name).prop('checked')) {
                    input = 'true';
                } else {
                    input = 'false';
                }
                break;

            default:
                input = $('#' + name).val();
                break;
        }

        result = input ? input : defaultVal;
        result = this.cleanVal(result, type);

        return result;
    },

    'getVars': function (varArr) {

        var result = {};

        if (!_.isArray(varArr)) {
            return null;
        }

        _.each(varArr, function (options) {

            var name,
                type,
                defaultVal,
                inputType,
                that;

            that = this;

            if (!_.isArray(options.name)) {

                name = options.name || '_id';
                type = options.type || 'none';

                defaultVal = options.defaultVal;
                inputType = options.inputType || 'default';

                result[name] = this.getVar(name, defaultVal, inputType, type);
            }

        }, this);

        return result;
    },

    'getInt': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || 0;
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'int');
    },

    'getNumber': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || 0;
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'number');
    },

    'getArray': function (name, defaultVal, inputType) {

        var that,
            options,
            values;

        that = this;

        options = $('#' + name + ' option:selected');

        values = $.map(options ,function(option) {

            return that.cleanVal(option.value, 'alnum');
        });

        return values;
    },

    'getFloat': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || 0;
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'float');
    },

    'getBool': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || false;
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'bool');
    },

    'getWord': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || '';
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'word');
    },

    'getWordNums': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || '';
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'wordnums');
    },

    'getAlnum': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || '';
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'alnum');
    },

    'getCmd': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || '';
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'cmd');
    },

    'getString': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || '';
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'string');
    },

    'getHtml': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || '';
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'html');
    },

    'getStringUrl': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || '';
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'stringurl');
    },

    'getMail': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || '';
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'mail');
    },

    'getUsername': function (name, defaultVal, inputType) {

        defaultVal = defaultVal || '';
        inputType = inputType || 'default';

        return this.getVar(name, defaultVal, inputType, 'username');
    },

    'cleanVal': function (varToClean, type) {

        //varToClean = varToClean.trim(); need to be realized

        varToClean = YaFilter.clean({
            'source': varToClean,
            'type': type
        });

        return varToClean;
    }
};
