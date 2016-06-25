"use strict";

$(document).ready(function () {
    $('.window').draggable({
        containment: 'document',
        handle: '.title-bar'
    });
});
