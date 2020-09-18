
// remove all ui elements
const removeElems = (ui) => {
    while(ui.firstChild) {
        ui.removeChild(ui.firstChild);
    }
};

// gui setup
function setupBasicUI(ui) {
    // reset ui style
    ui.style.zIndex = 1;
    ui.style.position = 'absolute';
    ui.style.display = 'block';
    ui.style.margin = '1em';
    //ui.style.opacity = '0.5';
    ui.style.width = '50%';
    ui.style.maxHeight = '100%';
    ui.style.color = 'yellow';
    ui.style.fontFamily = 'Arial, Helvetica, sans-serif';

    let logo = document.createElement('IMG');
    logo.style.margin = 'auto';
    logo.style.display = 'block';
    logo.src = 'stempowering.png';
    ui.appendChild(logo);

    let plate = document.createElement('DIV');
    plate.style.backgroundColor = '#000000';
    plate.style.borderRadius = '1em';
    plate.style.display = 'block';
    plate.style.width = '100%';
    ui.appendChild(plate);

    // text inside the plate
    let p = document.createElement('P');
    p.style.color = 'yellow';
    p.style.padding = '4em';
    let pContent = document.createTextNode('');
    p.appendChild(pContent);
    plate.appendChild(p);

    // next button
    let nextBtn = createButton(ui, 'Next >');   
    nextBtn.style.float = 'right'; 

    // return objects to manipulate basic ui
    return { plate, pContent, nextBtn, p };
}

// setup helper for buttons
function setupButton(elem, response) {
    elem.addEventListener('mousedown', () => {
        elem.style.boxShadow = '0 0 5px #ee01ff';
    });
    elem.addEventListener('mouseup', () => {
        elem.style.boxShadow = '';
        if (response) { response(); }
    });
}

// create button
function createButton(ui, text, response) {
    let btn = document.createElement('div');
    let cnt = document.createTextNode(text);
    btn.style.backgroundColor = 'black';
    btn.style.borderRadius = '1em';
    btn.style.display = 'inline-block';
    btn.style.padding = '1em';
    //btn.style.float = 'right';
    btn.appendChild(cnt);

    setupButton(btn, response);
    ui.appendChild(btn);

    return btn;
}

// create text boi
function createP(text) {
    let p = document.createElement('P');
    p.style.color = 'yellow';
    let pContent = document.createTextNode(text);
    p.appendChild(pContent);

    return {p, pContent};
}

// create text box
function createTxtIn(ui) {
    let box = document.createElement('INPUT');
    box.setAttribute('type', 'text');
    
    ui.appendChild(box);

    return box;
}

// creating list element
function createListElem(text, padTop) {
    let li = document.createElement('LI');
    let txt = document.createTextNode(text);
    if (padTop) {
        li.style.paddingTop = padTop;
    }
    li.appendChild(txt);

    return li;
}

// handlers for each button part
let handlers = [
    (ui, nextBtnHandler, sceneO) => { 
        sceneO.scene = sceneO.spaceScene;
        let uiO = setupBasicUI(ui); 
        uiO.pContent.textContent = 'Let\'s learn how orbits really work!'; 
        setupButton(uiO.nextBtn, nextBtnHandler);  
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'First, let\'s understand how things move here on Earth.';
        setupButton(uiO.nextBtn, nextBtnHandler);
    },
    (ui, nextBtnHandler, sceneO) => {
        sceneO.scene = sceneO.earthScene;
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'When we\'re close the ground, we can assume the ground to be essentially flat, and things fall straight toward it due to gravity.'
        setupButton(uiO.nextBtn, nextBtnHandler);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Let\'s do a little demonstration!';
        setupButton(uiO.nextBtn, nextBtnHandler);
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.cannon;
        cannon.rotateTube(90);

        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Fire the cannon and see what happens to the ball over time!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        uiO.nextBtn.style.display = 'none';
        //uiO.nextBtn.parentNode.removeChild(uiO.nextBtn);
        // create fire button
        let fireHandle = {};
        let fireBtn = createButton(ui, 'Fire!', () => { 
            cannon.fire(20); 
            ui.removeChild(fireBtn);
            fireBtn = createButton(ui, 'Fire!');
            fireBtn.style.color = 'red';
            fireBtn.style.opacity = '0.5';
            uiO.nextBtn.style.display = 'block';
        });
        //fireHandle = () => { cannon.fire(10); fireBtn.style.opacity = '0.5'; };
        fireBtn.style.color = 'red';

        ui.style.width = '25%';
        uiO.p.style.padding = '3em';

        let camera = sceneO.camera;
        camera.setPosition(new BABYLON.Vector3(0, 60, 120));
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'What happened?';
        uiO.p.style.fontSize = '1.1em';

        // explain what happened from here
        let ul = document.createElement('UL');

        ul.appendChild(createListElem('The ball left the cannon with a velocity going upward', '1em'));
        ul.appendChild(createListElem('The Earth is always pulling down on the ball with gravity', '1em'));
        ul.appendChild(createListElem('As a result, the ball slowed down', '1em'));
        ul.appendChild(createListElem('The ball eventually stopped, and sped up downward!', '1em'));

        uiO.plate.appendChild(ul);

        uiO.p.style.paddingBottom = '0';
        ul.style.padding = '5em';
        ul.style.paddingTop = '0';

        setupButton(uiO.nextBtn, nextBtnHandler);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Let\'s do that again, except with an arrow showing the speed and direction of the ball!';
        setupButton(uiO.nextBtn, nextBtnHandler);
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.cannon;

        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Fire the cannon and see what happens to the ball\'s speed and direction over time!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        uiO.nextBtn.style.display = 'none';
        //uiO.nextBtn.parentNode.removeChild(uiO.nextBtn);
        // create fire button
        let fireBtn = createButton(ui, 'Fire!', () => { 
            cannon.fire(20);
            ui.removeChild(fireBtn);
            fireBtn = createButton(ui, 'Fire!');
            fireBtn.style.color = 'red';
            fireBtn.style.opacity = '0.5';
            uiO.nextBtn.style.display = 'block';

            // store for later so that we can unregister velocity arrow drawing
            sceneO.velDrawer = () => {
                let size = cannon.ball.physicsImpostor.getLinearVelocity().y * 0.1;
                if (sceneO.velLine && sceneO.velLine.dispose) { // if its something we can dispose in babylon huyhn?
                    sceneO.velLine.dispose();
                }
                let bally = cannon.ball.position.y;
                sceneO.velLine = BABYLON.Mesh.CreateLines("ballVel", [
                    new BABYLON.Vector3(0, bally, 0), new BABYLON.Vector3(0, size + bally, 0), new BABYLON.Vector3( -0.05 * size, size * 0.95 + bally, 0), 
                    new BABYLON.Vector3(0, size + bally, 0), new BABYLON.Vector3( 0.05 * size, size * 0.95 + bally, 0)
                ], sceneO.scene);
                //cannon.node.position = cannon.ball.position;
                sceneO.velLine.color = BABYLON.Color3.Blue();
                sceneO.velLine.parent = cannon.node;
            };

            sceneO.scene.registerBeforeRender(sceneO.velDrawer);
        });
        //fireHandle = () => { cannon.fire(10); fireBtn.style.opacity = '0.5'; };
        fireBtn.style.color = 'red';

        ui.style.width = '25%';
        uiO.p.style.padding = '3em';

        let camera = sceneO.camera;
        camera.setPosition(new BABYLON.Vector3(4, 80, 150));

        //sceneO.cannon.ball.physicsImpostor = new BABYLON.PhysicsImpostor(sceneO.cannon.ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, sceneO.scene);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'If you\'re wondering, the reason the speed arrow moves so suddenly on the ground is due to the ball\'s movement being reversed immediately on collision.';
        setupButton(uiO.nextBtn, nextBtnHandler);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Let\'s fire the cannon again, except we\'ll fire at an angle, and we\'ll be able to draw out the path of the ball in green. You\'ll also be able to see the direction gravity is pointing from the ball in red.';
        setupButton(uiO.nextBtn, nextBtnHandler);

        sceneO.scene.unregisterBeforeRender(sceneO.velDrawer); // remove da goddamn ball velocity lines!
        sceneO.velLine.dispose();
        delete sceneO.velDrawer;
        delete sceneO.velLine;
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.cannon;
        cannon.rotateTube(-45);

        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Fire the cannon and watch the ball\'s path over time!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        uiO.nextBtn.style.display = 'none';
        //uiO.nextBtn.parentNode.removeChild(uiO.nextBtn);
        // create fire button
        let fireBtn = createButton(ui, 'Fire!', () => { 
            // line drawing function for ball
            sceneO.ballPath = new Set(); // store ball trajectory for deletion later
            let prevBallPos = {};
            let ballI = 0;
            sceneO.pathDrawer = () => {
                if (prevBallPos) {
                    let line = BABYLON.MeshBuilder.CreateLines('ballLine' + ballI, {points: [prevBallPos, cannon.ball.position]}, sceneO.scene);
                    line.color = BABYLON.Color3.Green();
                    sceneO.ballPath.add(line);
                    line.parent = cannon.node;
                }
                prevBallPos = cannon.ball.position;
                ballI++;
            };
            sceneO.scene.registerBeforeRender(sceneO.pathDrawer);

            sceneO.gravDrawer = () => {
                let size = -15 * 0.1;
                if (sceneO.gravLine && sceneO.gravLine.dispose) { // if its something we can dispose in babylon huyhn?
                    sceneO.gravLine.dispose();
                }
                let bally = cannon.ball.position.y;
                let ballx = cannon.ball.position.x;
                sceneO.gravLine = BABYLON.Mesh.CreateLines("ballVel", [
                    new BABYLON.Vector3(ballx, bally, 0), new BABYLON.Vector3(ballx, size + bally, 0), new BABYLON.Vector3( -0.2 * size + ballx, size * 0.80 + bally, 0), 
                    new BABYLON.Vector3(ballx, size + bally, 0), new BABYLON.Vector3( 0.2 * size + ballx, size * 0.80 + bally, 0)
                ], sceneO.scene);
                //cannon.node.position = cannon.ball.position;
                sceneO.gravLine.color = BABYLON.Color3.Red();
                sceneO.gravLine.parent = cannon.node;
            };

            sceneO.scene.registerBeforeRender(sceneO.gravDrawer);

            // this disables the ball once its gone too far down
            sceneO.ballDisable = () => {
                let limit = -5;
                if (cannon.ball.position.y < limit) {
                    cannon.ball.setEnabled(false);
                }
            };

            sceneO.scene.registerBeforeRender(sceneO.ballDisable);

            //cannon.ball.parent = cannon.node;
            cannon.fire(80); 
            ui.removeChild(fireBtn);
            fireBtn = createButton(ui, 'Fire!');
            fireBtn.style.color = 'red';
            fireBtn.style.opacity = '0.5';
            uiO.nextBtn.style.display = 'block';

            /*let worldMat = cannon.ball.computeWorldMatrix(true);
            cannon.ball.parent = null;
            let scale = 5;
            cannon.ball.scaling = new BABYLON.Vector3(scale, scale, scale);
            cannon.ball.position = BABYLON.Vector3.TransformCoordinates(cannon.ball.position, worldMat);*/
        });
        fireBtn.style.color = 'red';

        ui.style.width = '25%';
        uiO.p.style.padding = '3em';

        let camera = sceneO.camera;
        camera.setPosition(new BABYLON.Vector3(-900, 50, -400));
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Do you see that funny looking curve?';
        setupButton(uiO.nextBtn, nextBtnHandler);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'That shape is called a parabola, and that\'s the shape all objects make if they\'re moving and gravity is pulling with constant force on it!';
        setupButton(uiO.nextBtn, nextBtnHandler);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Try experimenting!';
        let p = createP('Change the angle of the cannon to see how the parabola changes!')
        p.p.style.marginLeft = '1em';
        p.p.style.marginBottom = '0.5em';
        ui.appendChild(p.p);

        let textIn = createTxtIn(ui);
        textIn.style.marginLeft = '1em';
        textIn.setAttribute('value', '45');
        setupButton(uiO.nextBtn, nextBtnHandler);

        // angle from last time to keep track of deltas
        let prevAngle = 45;
        let fireBtn = createButton(ui, 'Fire!', () => { 
            // line drawing function for ball
            sceneO.ballPath = new Set(); // store ball trajectory for deletion later
            let prevBallPos = {};
            let ballI = 0;

            sceneO.scene.unregisterBeforeRender(sceneO.pathDrawer);
            sceneO.pathDrawer = () => {
                if (prevBallPos) {
                    let line = BABYLON.MeshBuilder.CreateLines('ballLine' + ballI, {points: [prevBallPos, cannon.ball.position]}, sceneO.scene);
                    line.color = BABYLON.Color3.Green();
                    sceneO.ballPath.add(line);
                    line.parent = cannon.node;
                }
                prevBallPos = cannon.ball.position;
                ballI++;
            };
            sceneO.scene.registerBeforeRender(sceneO.pathDrawer);

            sceneO.gravDrawer = () => {
                let size = -15 * 0.1;
                if (sceneO.gravLine && sceneO.gravLine.dispose) { // if its something we can dispose in babylon huyhn?
                    sceneO.gravLine.dispose();
                }
                let bally = cannon.ball.position.y;
                let ballx = cannon.ball.position.x;
                sceneO.gravLine = BABYLON.Mesh.CreateLines("ballVel", [
                    new BABYLON.Vector3(ballx, bally, 0), new BABYLON.Vector3(ballx, size + bally, 0), new BABYLON.Vector3( -0.2 * size + ballx, size * 0.80 + bally, 0), 
                    new BABYLON.Vector3(ballx, size + bally, 0), new BABYLON.Vector3( 0.2 * size + ballx, size * 0.80 + bally, 0)
                ], sceneO.scene);
                //cannon.node.position = cannon.ball.position;
                sceneO.gravLine.color = BABYLON.Color3.Red();
                sceneO.gravLine.parent = cannon.node;
            };

            sceneO.scene.registerBeforeRender(sceneO.gravDrawer);

            // this disables the ball once its gone too far down
            sceneO.ballDisable = () => {
                let limit = -5;
                if (cannon.ball.position.y < limit) {
                    cannon.ball.setEnabled(false);
                }
            };

            sceneO.scene.registerBeforeRender(sceneO.ballDisable);

            // change angle, based on delta since cannon doesn't store current angle
            let currentAngle = textIn.value;
            let deltaAngle = currentAngle - prevAngle;
            prevAngle = currentAngle;
            cannon.rotateTube(deltaAngle);

            //cannon.ball.parent = cannon.node;
            cannon.fire(80); 
        });
        fireBtn.style.color = 'red';
        fireBtn.style.marginLeft = '1em';

        ui.style.width = '35%';
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Now, when we get to bigger scales, such as space, and higher speeds, we have to take into account the curvature of the Earth...';
        setupButton(uiO.nextBtn, nextBtnHandler);
    }
];