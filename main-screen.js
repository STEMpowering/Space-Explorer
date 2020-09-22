let ui = document.getElementById('ui');
let plainfo = document.getElementById('plainfo');

function computeLinePoints() {
    sceneO.linePoints = [];
    let w = sceneO.scene.getEngine().getRenderWidth();
    let h = sceneO.scene.getEngine().getRenderWidth();
    sceneO.linePoints.push(new BABYLON.Vector2(w * 0.52, h * 0.22));
    sceneO.linePoints.push(new BABYLON.Vector2(w * 0.64, h * 0.08));
}
//computeLinePoints();

canvas.addEventListener('click', () => {
    let pickRes = sceneO.scene.pick(sceneO.scene.pointerX, sceneO.scene.pointerY);
    if (pickRes.pickedMesh.info) {
        removeElems(plainfo);
        showPlanetInfo(pickRes.pickedMesh.name, pickRes.pickedMesh.info);
        // change view to proper planet
        sceneO.mainCamera.setTarget(pickRes.pickedMesh);
    }
});

function showPlanetInfo(name, info) {
    let plO = setupBasicUI(plainfo);
    plainfo.style.position = 'absolute';
    plainfo.style.right = 0;
    plO.logo.style.display = 'none';
    plO.nextBtn.style.display = 'none';
    plO.p.style.display = 'none';

    let title = document.createElement('H1');
    let titcnt = document.createTextNode(name);
    title.style.fontFamily = 'Audiowide-Reg';
    title.style.padding = '0.5em';
    title.style.textAlign = 'center';
    title.style.marginBottom = 0;
    title.appendChild(titcnt);
    plO.plate.appendChild(title);

    let descrip = createP(info);
    descrip.p.style.textAlign = 'center';
    descrip.p.style.padding = '1em';
    plO.plate.appendChild(descrip.p);

    plainfo.style.width = '35%';

    let backbtn = createButton(plainfo,'Back to the sun!', () => {
            removeElems(plainfo);
            sceneO.mainCamera.setTarget(sceneO.sun);
        });
    backbtn.style.float = 'right';

    // drawing lines
    //if (sceneO.pntLine)
        //sceneO.pntLine.dispose();

    /*let line = new BABYLON.GUI.Line();
    line.x1 = sceneO.linePoints[0].x;
    line.y1 = sceneO.linePoints[0].y;
    line.x2 = sceneO.linePoints[1].x;
    line.y2 = sceneO.linePoints[1].y;
    line.lineWidth = 2;
    line.color = "white";
    sceneO.advTex.addControl(line);
    sceneO.pntLine = line;*/
}

// setup main ui
function setupMainUI() {
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
            //sceneO.scene = sceneO.earthScene;
            removeElems(ui);
            removeElems(plainfo);
            setupOrbitScenes();
            //setupGUI();
        });
    btn.style.marginTop = '3em';
    btn.style.marginLeft = '2em';
}

setupMainUI();