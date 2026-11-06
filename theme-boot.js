// Applies the saved theme before first paint to avoid a colour flash.
(function () {
  try {
    var t = JSON.parse(localStorage.getItem('bcm-theme') || '{}')
    var d = document.documentElement
    ;['accent', 'bg', 'font'].forEach(function (k) {
      if (typeof t[k] === 'string' && /^[a-z]+$/.test(t[k])) d.setAttribute('data-' + k, t[k])
    })
  } catch (e) { /* storage unavailable — keep defaults */ }
})()
