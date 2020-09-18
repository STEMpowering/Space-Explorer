let canvas = document.getElementById('canvas');
        let engine = new BABYLON.Engine(canvas, true);

        const skyColor = new BABYLON.Color3(0.5, 0.5, 1);

        let cannon = {};
        let camera = {};

        const createEarthScene = function() {
            let scene = new BABYLON.Scene(engine);

            // physics setup
            let gravity = new BABYLON.Vector3(0,-10,0);
            let physPlug = new BABYLON.CannonJSPlugin();
            scene.enablePhysics(gravity, physPlug);

            scene.clearColor = skyColor;

            camera = new BABYLON.ArcRotateCamera("cramera", -Math.PI / 2,  Math.PI / 4, 100, BABYLON.Vector3.Zero(), scene);
            camera.attachControl(canvas);
            let light = new BABYLON.HemisphericLight('hemilite', new BABYLON.Vector3(0,50,0), scene);

            // ground w/ texture test
            let ground = BABYLON.MeshBuilder.CreateGround('ground', {width: 5000, height: 5000}, scene);
            let terrainMat = new BABYLON.StandardMaterial('terrainMat', scene); //new BABYLON.TerrainMaterial('terrMat', scene);
            terrainMat.diffuseTexture = new BABYLON.Texture('textures/grass.jpg', scene);
            terrainMat.diffuseTexture.uScale = terrainMat.diffuseTexture.vScale = 1000;
            terrainMat.specularColor = BABYLON.Color3.White();
            ground.material = terrainMat;

            // setup sky
            let skyMat = new BABYLON.SkyMaterial('skyMaterial', scene);
            skyMat.backFaceCulling = false;
            skyMat.luminance = 1;
            skyMat.turbidity = 20;
            skyMat.inclination = 0;
            skyMat.azimuth = 0.1;

            let skybox = new BABYLON.Mesh.CreateBox('skybox', 5000, scene);
            skybox.material = skyMat;

            // represents a cannon huyhn
            class Cannon {
                static startAngle = 5;
                static scale = 6;
                static tubeParts = new Set([5, 2, 16, 13, 14, 15, 9, 1, 12]);

                constructor(scene) {
                    this.scene = scene;

                    this.node = Cannon.CannonNode.clone();
                    this.tubeNode = Cannon.TubeNode.clone();
                    this.ball = Cannon.Ball.clone();

                    // ball physics
                    //this.ball.physicsImpostor = new BABYLON.PhysicsImpostor(this.ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);

                    this.tubeRotV = new BABYLON.Vector3(); this.tubeRotV.copyFrom(Cannon.TubeRotV);
                    this.tubeVec = new BABYLON.Vector3(); this.tubeVec.copyFrom(Cannon.TubeVec);
                    this.tubeRotV.parent = this.node;
                    this.tubeVec.parent = this.node;

                    this.tubeNode.parent = this.node;
                    this.ball.parent = this.node;

                    this.node.setEnabled(true);
                    this.ball.setEnabled(false);
                }
                // rotate tube by certain angle, including vector used to position tube when firing
                rotateTube(angle) {
                    this.tubeNode.rotate( this.tubeRotV, Math.PI / 180 * angle );

                    let rotMat = BABYLON.Matrix.RotationAxis(this.tubeRotV, Math.PI / 180 * angle)
                    this.tubeVec = BABYLON.Vector3.TransformCoordinates(this.tubeVec, rotMat);
                }
                translateTube(amount) {
                    this.tubeNode.translate( this.tubeVec, amount / 6 * Cannon.scale, BABYLON.Space.WORLD);
                }

                // fire cannon
                fire(speed) {
                    const frameRate = 5;
                    let keyframes = [];
                    keyframes.push({
                        frame: 0,
                        value: new BABYLON.Vector3(0,0,0)
                    });
                    keyframes.push({
                        frame: 0.1 * frameRate,
                        value: this.tubeVec.multiplyByFloats(-1,-1,-1)
                    });

                    keyframes.push({
                        frame: 1 * frameRate,
                        value: new BABYLON.Vector3(0,0,0)
                    });
                    let anim = new BABYLON.Animation("fireCannon", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                    anim.setKeys(keyframes);

                    this.scene.beginDirectAnimation(this.tubeNode, [anim], 0, 1 * frameRate, true);

                    // fire the ball
                    // first correct its position into cannon coordinates
                    this.ball.parent = this.node;
                    this.ball.position = this.tubeVec.multiplyByFloats(1.75,1.75,1.75);

                    let ballVelocity = this.tubeVec.multiplyByFloats(speed, speed, speed);
                    this.ball.physicsImpostor.setLinearVelocity(ballVelocity);

                    this.ball.setEnabled(true);

                    // now correct ball back into world coordinates
                    /*let worldMat = this.ball.computeWorldMatrix(true);
                    this.ball.parent = null;
                    let scale = 5;
                    this.ball.scaling = new BABYLON.Vector3(scale, scale, scale);
                    this.ball.position = BABYLON.Vector3.TransformCoordinates(this.ball.position, worldMat);*/

                    return anim;
                }
            }

            // import mesh demo
            BABYLON.SceneLoader.ImportMesh("", "cannon/", "cannon.babylon", scene, function (meshes, particles, skeletons) {          
                // indices of cannon barrel parts
                let tubeParts = Cannon.tubeParts;
                let tubeVec = new BABYLON.Vector3(-1,0,0);
                let tubeRotV = new BABYLON.Vector3(0,0,-1);

                // create a node which pre much represents the cannon
                let cannonNode = new BABYLON.TransformNode('cannNode');
                let tubeNode = new BABYLON.TransformNode('tubeNode');
                meshes.forEach((mesh, index) => {
                    mesh.parent = cannonNode;
                    if (tubeParts.has(index)) { // assign tube node as parent to any tube part
                        mesh.parent = tubeNode;
                    }
                });
                cannonNode.scaling = new BABYLON.Vector3(Cannon.scale, Cannon.scale, Cannon.scale);
                // rotate tube to be level with vector
                tubeNode.rotate( tubeRotV, -Math.PI / 180 * Cannon.startAngle );

                // hide or show
                cannonNode.setEnabled(false);
                tubeNode.setEnabled(false);
                Cannon.Meshes = meshes;
                Cannon.CannonNode = cannonNode;
                Cannon.TubeNode = tubeNode;
                Cannon.TubeVec = tubeVec;
                Cannon.TubeRotV = tubeRotV;

                Cannon.Ball = meshes[3];
                // detach ball parent
                Cannon.Ball.parent = null;

                // give the ball physics
                Cannon.Ball.physicsImpostor = new BABYLON.PhysicsImpostor(Cannon.Ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
                
                ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
                cannon = cannonsSetup(scene, ground);

                setupGUI();
            });

            function cannonsSetup(scene, ground) {
                // create some cannons yaa
                let cannon = new Cannon(scene);
                cannon.node.position.y += 20;
                //cannon.rotateTube(-30);

                //cannon.fire();

                return cannon;
            }

            return scene;
        };

        // creating space scene
        const createSpaceScene = function() {
            let scene = new BABYLON.Scene(engine);

            scene.clearColor = BABYLON.Color3.Black();

            let spaceCam = new BABYLON.ArcRotateCamera("spaceCam", -Math.PI / 2,  Math.PI / 4, 320, BABYLON.Vector3.Zero(), scene);
            spaceCam.attachControl(canvas);
            //let light = new BABYLON.HemisphericLight('hemilite', new BABYLON.Vector3(0,50,0), scene);

            let skydome = new BABYLON.MeshBuilder.CreateSphere('skydome', { diameter: 5000 }, scene);

            let spacemat = new BABYLON.StandardMaterial('spacemat', scene);
            spacemat.emissiveTexture = new BABYLON.Texture('textures/space-dome.jpg', scene);
            spacemat.backFaceCulling = false;
            skydome.material = spacemat;

            // physics setup
            let gravity = new BABYLON.Vector3(0,0,0);
            let physPlug = new BABYLON.CannonJSPlugin();
            scene.enablePhysics(gravity, physPlug);

            // test ball
            let ball = new BABYLON.MeshBuilder.CreateSphere('testball', {diameter: 10}, scene);
            ball.position.y = 40;
            ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
            
            // create earth
            let earth = new BABYLON.MeshBuilder.CreateSphere('earth', { diameter: 50 }, scene);
            let earthmat = new BABYLON.StandardMaterial('earthmat', scene);
            earthmat.emissiveTexture = new BABYLON.Texture('textures/earth.jpg', scene);
            earthmat.backFaceCulling = false;
            earth.material = earthmat;
            // rotate earth so that it aint upside down
            let axis = new BABYLON.Vector3(1,0,0);
            earth.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(axis, Math.PI);

            earth.physicsImpostor = new BABYLON.PhysicsImpostor(earth, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, restitution: 0.9 }, scene);

            // calculate keplerian orbit
            let center = earth.position;

            let orbitElems = keplerElems(new BABYLON.Vector3(190, 0, 0), ball.position, center, 1000000);
            let orbitPoints = computeOrbit(center, orbitElems, 200);

            for (let i = 0; i < orbitPoints.length - 1; i++) {
                let line = BABYLON.MeshBuilder.CreateLines('orbit', {points: [orbitPoints[i], orbitPoints[i+1]]}, scene);
                line.color = BABYLON.Color3.Green();
            }

            // make ball move on da rails of the orbit points
            let currentPoint = 0;
            let nextPoint = 1;

            let delta = 0;
            scene.registerBeforeRender(() => {
                let deltaT = scene.getEngine().getDeltaTime();

                let p1 = orbitPoints[currentPoint];
                let p2 = orbitPoints[nextPoint];

                // interpolation vectors
                let deltaR = p2.subtract(p1);
                let rn = BABYLON.Vector3.Normalize(deltaR);
                let r = deltaR.length();

                // compute speed
                let distV = ball.position.subtract(earth.position);
                let dist = distV.length();
                let speed = computeSpeed(orbitElems.E0, 1000000, dist);
                speed *= .0008;

                delta += speed * deltaT;

                while (delta > r) {
                    delta -= r;

                    currentPoint++;
                    nextPoint++;
                    if (nextPoint >= orbitPoints.length) {
                        nextPoint = 0;
                    }
                    if (currentPoint >= orbitPoints.length) {
                        currentPoint = 0;
                    }

                    p1 = orbitPoints[currentPoint];
                    p2 = orbitPoints[nextPoint];

                    deltaR = p2.subtract(p1);
                    rn = BABYLON.Vector3.Normalize(deltaR);
                    r = deltaR.length();
                }
                let position = rn.multiplyByFloats(delta, delta, delta);
                position = position.add(p1);
                ball.position = position;
            });

            return scene;
        }
        
        let sceneO = { earthScene: createEarthScene(), spaceScene: createSpaceScene(), cannon, camera }; // pack up required refs
        sceneO.scene = sceneO.earthScene;

        engine.runRenderLoop(function() {
            sceneO.scene.render();
        });

        window.addEventListener('resize', () => {
            engine.resize();
        });

        // gui stuff
        function setupGUI() {
            sceneO.cannon = cannon;
            sceneO.camera = camera;

            let ui = document.getElementById('ui');

            // shit for gui change
            let handI = 0;
            function nextBtnHandler() { // next button response handle, change shit on screen
                removeElems(ui);
                handI++;
                handlers[handI](ui, nextBtnHandler, sceneO);
            }
            handlers[handI](ui, nextBtnHandler, sceneO);
        }