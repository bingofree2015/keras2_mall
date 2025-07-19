window.WEP.init = krpano => {
    if (document.querySelector('#wep')) {
        return
    }

    const wepEl = document.createElement('div')
    wepEl.id = 'wep'
    document.body.appendChild(wepEl)

    window.WEP.krpano = krpano

    new Vue({
        el: '#wep',
        template: '<wep />',
        components: {
            wep: wep
        }
    })
}
