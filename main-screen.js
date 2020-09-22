let ui = document.getElementById('ui');

// setup main ui
let uiO = setupBasicUI(ui);
ui.style.width = '35%';

uiO.nextBtn.style.display = 'none';
uiO.p.style.fontFamily = 'Audiowide-Reg';
uiO.p.style.fontSize = '2em';
uiO.p.style.padding = '1.8em';
uiO.p.style.textAlign = 'center';
uiO.p.style.position = 'relative';
uiO.p.style.marginBottom = 0;
//uiO.p.style.bottom = '0.5em';
uiO.pContent.textContent = 'SPACE EXPLORER';

let rocket = document.createElement('IMG');
rocket.setAttribute('src', 'rocket.png');
rocket.style.width = '3em';
rocket.style.position = 'relative';
rocket.style.top = '0.5em';
rocket.style.padding = '0';
uiO.plate.style.margin = '0';
uiO.p.appendChild(rocket);

let para = createP('Click on a planet to learn about it, or click on an activity below. (More may be coming!)');
para.p.style.paddingBottom = '1.8em';
para.p.style.paddingLeft = '1.8em';
para.p.style.paddingRight = '1.8em';
para.p.style.paddingTop = 0;
para.p.style.margin = '0';
para.p.style.textAlign = 'center';
uiO.plate.appendChild(para.p);

let btn = createButton(ui, 'Learn about Orbits!', () => {
        sceneO.scene = sceneO.space;
        removeElems(ui);
        setupGUI();
    });
btn.style.marginTop = '3em';
btn.style.marginLeft = '2em';