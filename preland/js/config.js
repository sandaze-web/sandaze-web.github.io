//ссылка которая заменит все ссылки на странице
let link_cross = ''

$(document).ready(function () {
    let n = $.urlParam('n')
    if (n) {
        link_cross = decodeURIComponent(escape(window.atob(n)))
        console.log(link)
    }
    $('body').find('a').attr('href', link_cross).attr('target', '_blank')
})