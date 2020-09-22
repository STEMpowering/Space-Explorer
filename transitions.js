
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
    return { plate, pContent, nextBtn, p, logo };
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

// create text box
function createRange(ui, min, max, step) {
    let range = document.createElement('INPUT');
    range.setAttribute('type', 'range');
    range.setAttribute('max', max);
    range.setAttribute('min', min);
    range.setAttribute('step', step);
    ui.appendChild(range);

    return range;
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
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'First, let\'s understand how things move here on Earth.';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        sceneO.scene = sceneO.earthScene;
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'When we\'re close the ground, we can assume the ground to be essentially flat, and things fall straight toward it due to gravity.'
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Let\'s do a little demonstration!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.earth.cannon;
        //console.log(sceneO.earth.cannon);
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

        let camera = sceneO.earth.camera;
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
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Let\'s do that again, except with an arrow showing the speed and direction of the ball!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.earth.cannon;

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

        let camera = sceneO.earth.camera;
        camera.setPosition(new BABYLON.Vector3(4, 80, 150));

        //sceneO.cannon.ball.physicsImpostor = new BABYLON.PhysicsImpostor(sceneO.cannon.ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, sceneO.scene);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'If you\'re wondering, the reason the speed arrow moves so suddenly on the ground is due to the ball\'s movement being reversed immediately on collision.';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Let\'s fire the cannon again, except we\'ll fire at an angle, and we\'ll be able to draw out the path of the ball in green. You\'ll also be able to see the direction gravity is pointing from the ball in red.';
        setupButton(uiO.nextBtn, nextBtnHandler);

        sceneO.scene.unregisterBeforeRender(sceneO.velDrawer); // remove da goddamn ball velocity lines!
        if (sceneO.velLines) {
            sceneO.velLine.dispose();
        }
        delete sceneO.velDrawer;
        sceneO.velLine.dispose();
        delete sceneO.velLine;
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.earth.cannon;
        cannon.rotateTube(-45);

        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Fire the cannon and watch the ball\'s path over time!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        uiO.nextBtn.style.display = 'none';
        //uiO.nextBtn.parentNode.removeChild(uiO.nextBtn);
        // create fire button
        let fireBtn = createButton(ui, 'Fire!', () => { 
            // line drawing function for ball
            sceneO.ballPath = []; // store ball trajectory for deletion later
            let prevBallPos = {};
            let ballI = 0;
            sceneO.pathDrawer = () => {
                if (prevBallPos) {
                    let line = BABYLON.MeshBuilder.CreateLines('ballLine' + ballI, {points: [prevBallPos, cannon.ball.position]}, sceneO.scene);
                    line.color = BABYLON.Color3.Green();
                    sceneO.ballPath.push(line);
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
                let limit = -100;
                if (cannon.ball.position.y < limit) {
                    sceneO.scene.unregisterBeforeRender(sceneO.pathDrawer);
                    sceneO.scene.unregisterBeforeRender(sceneO.gravDrawer);
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
        });
        fireBtn.style.color = 'red';

        ui.style.width = '25%';
        uiO.p.style.padding = '3em';

        let camera = sceneO.earth.camera;
        camera.setPosition(new BABYLON.Vector3(-900, 50, -400));
        //addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Do you see that funny looking curve?';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'That shape is called a parabola, and that\'s the shape all objects make if they\'re moving and gravity is pulling with constant force on it!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
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

        let cannon = sceneO.earth.cannon;

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
                let limit = -100;
                if (cannon.ball.position.y < limit) {
                    sceneO.scene.unregisterBeforeRender(sceneO.pathDrawer);
                    sceneO.scene.unregisterBeforeRender(sceneO.gravDrawer);
                }
            };

            sceneO.scene.registerBeforeRender(sceneO.ballDisable);

            // change angle, based on delta since cannon doesn't store current angle
            if (!isNaN(textIn.value)) {
                let currentAngle = textIn.value;
                let deltaAngle = currentAngle - prevAngle;
                prevAngle = currentAngle;
                cannon.rotateTube(deltaAngle);
            }

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
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        sceneO.scene = sceneO.spaceScene;
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Now we\'re back to space!';
        setupButton(uiO.nextBtn, nextBtnHandler);

        // delete the garbage we don't need
        sceneO.space.ball.dispose();
        sceneO.space.orbitalLines.forEach((line, index) => {
            line.dispose();
        });

        // create cannon for our space scene woo
        let cannon = new Cannon(sceneO.scene, true);
        sceneO.space.cannon = cannon;
        cannon.node.position.y += 30;
        cannon.node.scaling = new BABYLON.Vector3(2,2,2);

        sceneO.space.camera.setPosition(new BABYLON.Vector3(0,80,60));
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'This time, however, we brought our cannon over, and we scaled it up.';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'This means that, when we fire this cannon, the ball will be moving much faster than it was on Earth!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Hence, now we must consider the curvature of the Earth for our projectiles.';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Let\'s fire one at low power, shall we?';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.space.cannon;

        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Fire the cannon and watch the path of the ball!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        uiO.nextBtn.style.display = 'none';
        // create fire button
        let fireHandle = {};
        let fireBtn = createButton(ui, 'Fire!', () => { 
            cannon.fire(0, true);
            cannon.ball.physicsImpostor.dispose();
            cannon.ball.scaling = new BABYLON.Vector3(2,2,2);
            
            ui.removeChild(fireBtn);
            fireBtn = createButton(ui, 'Fire!');
            fireBtn.style.color = 'red';
            fireBtn.style.opacity = '0.5';
            uiO.nextBtn.style.display = 'block';

            // compute orbit for this trajectory
            let ball = cannon.ball;

            let orbitElems = keplerElems(new BABYLON.Vector3(0.00001, 0, 0), ball.position, sceneO.space.earth.position, 0.000001);
            let orbitPoints = computeOrbit(sceneO.space.earth.position, orbitElems, 600);

            let prevBallPos = null;
            let ballI = 0;
            
            sceneO.ballPath.forEach((line, index) => {
                line.dispose();
            });
            sceneO.ballPath = [];
            sceneO.pathDrawer = () => {
                if (!ball.isEnabled()) {
                    return;
                }
                if (prevBallPos) {
                    let line = BABYLON.MeshBuilder.CreateLines('orbitlines' + ballI, {points: [prevBallPos, cannon.ball.position]}, sceneO.scene);
                    line.color = BABYLON.Color3.Green();
                    sceneO.ballPath.push(line);
                }
                prevBallPos = cannon.ball.position;
                ballI++;
            };
            sceneO.scene.registerBeforeRender(sceneO.pathDrawer);

            // disable ball when colliding with earth
            sceneO.ballDisabler = () => {
                let rad = ball.position.subtract(sceneO.space.earth.position);
                if (rad.length() < 20) {
                    ball.setEnabled(false);
                }
            }; 
            sceneO.scene.registerBeforeRender(sceneO.ballDisabler)

            sceneO.orbitFunc = runOrbit(ball, sceneO.space.earth.position, orbitPoints, orbitElems, sceneO.scene, 0.00021);

            // delete lines if too many
            sceneO.orbitDeleter = () => {
                if (!sceneO.ballPath) {
                    return;
                }
                if (sceneO.ballPath.length > 900) {
                    sceneO.ballPath[0].dispose();
                    sceneO.ballPath.shift();
                }
            };
            sceneO.scene.registerBeforeRender(sceneO.orbitDeleter);
        });
        //fireHandle = () => { cannon.fire(10); fireBtn.style.opacity = '0.5'; };
        fireBtn.style.color = 'red';

        ui.style.width = '25%';
        uiO.p.style.padding = '3em';
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = '...Alright, was that really unexpected?';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'But, let\'s see what happens if we increase the power a bit!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.space.cannon;

        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Fire the cannon at higher power and watch the path of the ball!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        uiO.nextBtn.style.display = 'none';

        // delete da lines
        sceneO.ballPath.forEach((line, index) => {
            line.dispose();
        });
        sceneO.ballPath = [];
        sceneO.scene.unregisterBeforeRender(sceneO.pathDrawer);
        // remove other bs from last time
        sceneO.scene.unregisterBeforeRender(sceneO.orbitFunc);
        sceneO.scene.unregisterBeforeRender(sceneO.ballDisabler);

        // create fire button
        let fireHandle = {};
        let fireBtn = createButton(ui, 'Fire!', () => { 
            cannon.fire(0, true);
            //cannon.ball.physicsImpostor.dispose();
            //cannon.ball.scaling = new BABYLON.Vector3(2,2,2);
            cannon.ball.setEnabled(true);
            
            ui.removeChild(fireBtn);
            fireBtn = createButton(ui, 'Fire!');
            fireBtn.style.color = 'red';
            fireBtn.style.opacity = '0.5';
            uiO.nextBtn.style.display = 'block';

            // compute orbit for this trajectory
            let ball = cannon.ball;

            let orbitElems = keplerElems(new BABYLON.Vector3(0.0001, 0, 0), ball.position, sceneO.space.earth.position, 0.000001);
            let orbitPoints = computeOrbit(sceneO.space.earth.position, orbitElems, 400);

            let prevBallPos = null;
            let ballI = 0;
            if (!sceneO.ballPath) {
                sceneO.ballPath = [];
            }
            sceneO.orbitDrawrr = () => {
                if (!ball.isEnabled()) {
                    return;
                }
                if (prevBallPos) {
                    let line = BABYLON.MeshBuilder.CreateLines('orbitlinesA' + ballI, {points: [prevBallPos, cannon.ball.position]}, sceneO.scene);
                    line.color = BABYLON.Color3.Green();
                    sceneO.ballPath.push(line);
                }
                prevBallPos = cannon.ball.position;
                ballI++;
            };
            sceneO.scene.registerBeforeRender(sceneO.orbitDrawrr);
            
            // disable ball when colliding with earth
            sceneO.ballDisabler = () => {
                let rad = ball.position.subtract(sceneO.space.earth.position);
                if (rad.length() < 20) {
                    ball.setEnabled(false);
                }
            }; 
            sceneO.scene.registerBeforeRender(sceneO.ballDisabler)

            sceneO.orbitFunc = runOrbit(ball, sceneO.space.earth.position, orbitPoints, orbitElems, sceneO.scene, 0.00021);
            
        });
        //fireHandle = () => { cannon.fire(10); fireBtn.style.opacity = '0.5'; };
        fireBtn.style.color = 'red';

        ui.style.width = '25%';
        uiO.p.style.padding = '3em';
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Do you see that?';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'It\'s as if the ball is curving around the Earth!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Let\'s keep trying slightly more power for each run!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.space.cannon;

        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Fire the cannon at higher power and watch the path of the ball!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        uiO.nextBtn.style.display = 'none';

        // delete da lines
        sceneO.ballPath.forEach((line, index) => {
            line.dispose();
        });
        sceneO.ballPath = [];
        sceneO.scene.unregisterBeforeRender(sceneO.orbitDrawrr);
        // remove other bs from last time
        sceneO.scene.unregisterBeforeRender(sceneO.orbitFunc);
        sceneO.scene.unregisterBeforeRender(sceneO.ballDisabler);

        // create fire button
        let fireHandle = {};
        let fireBtn = createButton(ui, 'Fire!', () => { 
            cannon.fire(0, true);
            //cannon.ball.physicsImpostor.dispose();
            //cannon.ball.scaling = new BABYLON.Vector3(2,2,2);
            cannon.ball.setEnabled(true);
            
            ui.removeChild(fireBtn);
            fireBtn = createButton(ui, 'Fire!');
            fireBtn.style.color = 'red';
            fireBtn.style.opacity = '0.5';
            uiO.nextBtn.style.display = 'block';

            // compute orbit for this trajectory
            let ball = cannon.ball;

            let orbitElems = keplerElems(new BABYLON.Vector3(0.00017, 0, 0), ball.position, sceneO.space.earth.position, 0.000001);
            let orbitPoints = computeOrbit(sceneO.space.earth.position, orbitElems, 400);

            let prevBallPos = null;
            let ballI = 0;
            if (!sceneO.ballPath) {
                sceneO.ballPath = [];
            }
            sceneO.orbitDrawrr = () => {
                if (!ball.isEnabled()) {
                    return;
                }
                if (prevBallPos) {
                    let line = BABYLON.MeshBuilder.CreateLines('orbitlinesA' + ballI, {points: [prevBallPos, cannon.ball.position]}, sceneO.scene);
                    line.color = BABYLON.Color3.Green();
                    sceneO.ballPath.push(line);
                }
                prevBallPos = cannon.ball.position;
                ballI++;
            };
            sceneO.scene.registerBeforeRender(sceneO.orbitDrawrr);
            
            // disable ball when colliding with earth
            sceneO.ballDisabler = () => {
                let rad = ball.position.subtract(sceneO.space.earth.position);
                if (rad.length() < 24) {
                    ball.setEnabled(false);
                }
            }; 
            sceneO.scene.registerBeforeRender(sceneO.ballDisabler)

            sceneO.orbitFunc = runOrbit(ball, sceneO.space.earth.position, orbitPoints, orbitElems, sceneO.scene, 0.00021);
            
        });
        //fireHandle = () => { cannon.fire(10); fireBtn.style.opacity = '0.5'; };
        fireBtn.style.color = 'red';

        ui.style.width = '25%';
        uiO.p.style.padding = '3em';
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'The ball isn\'t going only downwards anymore...';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Instead, it keeps getting attracted toward the Earth.';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'It\'s as if the ball keeps trying to hit Earth, but it\'s missing because of its speed!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Let\'s increase the power one more time!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.space.cannon;

        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Fire the cannon at higher power and watch the path of the ball!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        uiO.nextBtn.style.display = 'none';

        // delete da lines
        sceneO.ballPath.forEach((line, index) => {
            line.dispose();
        });
        sceneO.ballPath = [];
        sceneO.scene.unregisterBeforeRender(sceneO.orbitDrawrr);
        // remove other bs from last time
        sceneO.scene.unregisterBeforeRender(sceneO.orbitFunc);
        sceneO.scene.unregisterBeforeRender(sceneO.ballDisabler);

        // create fire button
        let fireHandle = {};
        let fireBtn = createButton(ui, 'Fire!', () => { 
            cannon.fire(0, true);
            //cannon.ball.physicsImpostor.dispose();
            //cannon.ball.scaling = new BABYLON.Vector3(2,2,2);
            cannon.ball.setEnabled(true);
            
            ui.removeChild(fireBtn);
            fireBtn = createButton(ui, 'Fire!');
            fireBtn.style.color = 'red';
            fireBtn.style.opacity = '0.5';
            uiO.nextBtn.style.display = 'block';

            // compute orbit for this trajectory
            let ball = cannon.ball;

            let orbitElems = keplerElems(new BABYLON.Vector3(0.000205, 0, 0), ball.position, sceneO.space.earth.position, 0.000001);
            let orbitPoints = computeOrbit(sceneO.space.earth.position, orbitElems, 400);

            let prevBallPos = null;
            let ballI = 0;
            if (!sceneO.ballPath) {
                sceneO.ballPath = [];
            }
            sceneO.orbitDrawrr = () => {
                if (!ball.isEnabled()) {
                    return;
                }
                if (prevBallPos) {
                    let line = BABYLON.MeshBuilder.CreateLines('orbitlinesA' + ballI, {points: [prevBallPos, cannon.ball.position]}, sceneO.scene);
                    line.color = BABYLON.Color3.Green();
                    sceneO.ballPath.push(line);
                }
                prevBallPos = cannon.ball.position;
                ballI++;
            };
            sceneO.scene.registerBeforeRender(sceneO.orbitDrawrr);
            
            // disable ball when colliding with earth
            sceneO.ballDisabler = () => {
                let rad = ball.position.subtract(sceneO.space.earth.position);
                if (rad.length() < 24) {
                    ball.setEnabled(false);
                }
            }; 
            sceneO.scene.registerBeforeRender(sceneO.ballDisabler)

            sceneO.orbitFunc = runOrbit(ball, sceneO.space.earth.position, orbitPoints, orbitElems, sceneO.scene, 0.00021);
        });
        //fireHandle = () => { cannon.fire(10); fireBtn.style.opacity = '0.5'; };
        fireBtn.style.color = 'red';

        ui.style.width = '25%';
        uiO.p.style.padding = '3em';
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'The ball is no longer hitting the Earth...';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Awesome! You\'ve just put your first object into orbit!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'That\'s essentially what an orbit is - launching something so fast that it misses the body it is orbitting.';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'That is what the cannon ball is doing, and that is what the Moon does too!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'That is why, even though the Earth has gravity, the Moon doesn\'t come crashing into the Earth!';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'This is also what the rest of the planets do around the Sun.';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler) => {
        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Anyway, as a prize for your achievement, you can now mess around with the cannon and see what kind of orbits you can make! :D';
        setupButton(uiO.nextBtn, nextBtnHandler);
        addRetBtn(ui, sceneO);
    },
    (ui, nextBtnHandler, sceneO) => {
        let cannon = sceneO.space.cannon;

        let uiO = setupBasicUI(ui);
        uiO.pContent.textContent = 'Mess around as you please! :D';
        setupButton(uiO.nextBtn, nextBtnHandler);

        uiO.nextBtn.style.display = 'none';

        let d = createP('Change the power of the cannon!')
        d.p.style.marginLeft = '1em';
        d.p.style.marginBottom = '0.5em';
        ui.appendChild(d.p);

        let range = createRange(ui, 0, 0.0003, 0.000001);
        range.style.display = 'block';
        range.style.marginLeft = '1em';
        range.value = '0.000205';
        ui.appendChild(range);

        // create fire button
        let fireHandle = {};
        let prevAngle = 0;
        let fireBtn = createButton(ui, 'Fire!', () => { 
            // delete da lines
            sceneO.ballPath.forEach((line, index) => {
                line.dispose();
            });
            sceneO.ballPath = [];
            sceneO.scene.unregisterBeforeRender(sceneO.orbitDrawrr);
            // remove other bs from last time
            sceneO.scene.unregisterBeforeRender(sceneO.orbitFunc);
            sceneO.scene.unregisterBeforeRender(sceneO.ballDisabler);

            cannon.fire(0, true);
            //cannon.ball.physicsImpostor.dispose();
            //cannon.ball.scaling = new BABYLON.Vector3(2,2,2);
            cannon.ball.setEnabled(true);

            // compute orbit for this trajectory
            let ball = cannon.ball;

            let orbitElems = keplerElems(new BABYLON.Vector3(range.value, 0, 0), ball.position, sceneO.space.earth.position, 0.000001);
            let orbitPoints = computeOrbit(sceneO.space.earth.position, orbitElems, 400);

            let prevBallPos = null;
            let ballI = 0;
            if (!sceneO.ballPath) {
                sceneO.ballPath = [];
            }
            sceneO.orbitDrawrr = () => {
                if (!ball.isEnabled()) {
                    return;
                }
                if (prevBallPos) {
                    let line = BABYLON.MeshBuilder.CreateLines('orbitlinesA' + ballI, {points: [prevBallPos, cannon.ball.position]}, sceneO.scene);
                    line.color = BABYLON.Color3.Green();
                    sceneO.ballPath.push(line);
                }
                prevBallPos = cannon.ball.position;
                ballI++;
            };
            sceneO.scene.registerBeforeRender(sceneO.orbitDrawrr);
            
            // disable ball when colliding with earth
            sceneO.ballDisabler = () => {
                let rad = ball.position.subtract(sceneO.space.earth.position);
                if (rad.length() < 24) {
                    ball.setEnabled(false);
                }
            }; 
            sceneO.scene.registerBeforeRender(sceneO.ballDisabler)

            sceneO.orbitFunc = runOrbit(ball, sceneO.space.earth.position, orbitPoints, orbitElems, sceneO.scene, 0.00021);
            
        });
        //fireHandle = () => { cannon.fire(10); fireBtn.style.opacity = '0.5'; };
        fireBtn.style.color = 'red';
        fireBtn.style.marginLeft = '1em';
        fireBtn.style.marginTop = '1em';

        ui.style.width = '25%';
        uiO.p.style.padding = '3em';

        // insert button to return to main screen
        addRetBtn(ui, sceneO);
    }
];

// insert button to return to main screen
function addRetBtn(ui, sceneO) {
    // insert button to return to main screen
    let retbtn = createButton(ui, 'Return to the Sun', () =>{
        sceneO.scene = sceneO.main;
        removeElems(ui);
        setupMainUI();

        if (sceneO.earthScene)
            sceneO.earthScene.dispose();
        if (sceneO.spaceScene)
            sceneO.spaceScene.dispose();
    });
    retbtn.style.margin = '1em';
    //retbtn.style.marginLeft = '8em';
    ui.appendChild(retbtn);

    return retbtn;
}