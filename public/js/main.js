$(function() {
    if ($('textarea#ta').length) {
        CKEDITOR.replace('ta');
    }

    $('a.confirmDeletion').on('click', () => {
        if (!confirm('Confirm deletion')) return false;
    });
});