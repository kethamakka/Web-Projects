$(document).ready(function () {
    $("#addTile").trigger('click');
    $(document).on('click', '#setGoogle', function () {
        alert('click event is triggered');
    });
    $("#setGoogle").trigger('click');
});