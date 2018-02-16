const moment = require('moment');

module.exports = {
    truncate: function(str, len) {
        if (str.length > len && str.length > 0) {
            var newStr = str + ' ';
            newStr = str.substr(0, len);
            newStr = str.substr(0,newStr.lastIndexOf(' '));
            newStr = (newStr.length > 0) ? newStr  : str.substr(0, len);
            return newStr + '...';
        } 
        return str;
    },
    stripTags: function(input) {
        return input.replace(/<(?:.|\n)*?>/gm, '');
    },
    formatDate: function(date, format) {
        return moment(date).format(format);
    },
    checkStatus: function(status, optionValue) {
        return (String(status) === String(optionValue)) ? 'selected' : '';
    },
    isChecked: function(allowComments) {
        return (allowComments) ? 'checked' : '';
    },
    editIcon: function(storyUser, loggedUser, storyId, floating = true)  {
        if (storyUser === loggedUser) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red">
                <i class="fa fa-pencil"></i>
                </a>`;
            } else {
                return `<a href="/stories/edit/${storyId}">
                <i class="fa fa-pencil"></i>
                </a>`;
            }
        } else {
            return '';
        }
    }
}