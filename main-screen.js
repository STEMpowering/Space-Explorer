let ui = document.getElementById('ui');

// setup main ui
let uiO = setupBasicUI(ui);
uiO.nextBtn.style.display = 'none';
uiO.p.style.fontFamily = 'Audiowide-Reg';
uiO.p.style.fontSize = '2em';
uiO.p.style.padding = '1.8em';
uiO.p.style.textAlign = 'center';
uiO.p.style.position = 'relative';
uiO.p.style.bottom = '0.5em';
uiO.pContent.textContent = 'SPACE EXPLORER';

let rocket = document.createElement('IMG');
rocket.setAttribute('src', 'rocket.png');
rocket.style.width = '3em';
rocket.style.marginLeft = '0.5em';
rocket.style.position = 'relative';
rocket.style.top = '0.5em';
uiO.p.appendChild(rocket);