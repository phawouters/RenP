document.addEventListener('DOMContentLoaded', function () {
    const select = document.getElementById('put-select');
    const panels = document.querySelectorAll('#tab-panel-area .tab-panel');

    select.addEventListener('change', function () {
        panels.forEach(function (p) { p.style.display = 'none'; });
        const active = document.getElementById('panel-' + select.value);
        if (active) active.style.display = 'block';
    });
});
