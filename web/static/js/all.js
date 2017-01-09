function loadDoc() {
    $('.demo').on('click','button', function () {
        $.ajax('http://www.google.com',{
            success: function (response) {
                $('.ticket').html(response).slideDown();
            }
        });
    });
}