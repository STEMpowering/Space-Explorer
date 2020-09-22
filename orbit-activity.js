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

    // cannon import
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

        return cannon;
    }

    return scene;
};

let debugCallback = {};
// space vars
let space = {};
// creating space scene
const createSpaceScene = function() {
    let scene = new BABYLON.Scene(engine);

    scene.clearColor = BABYLON.Color3.Black();

    let spaceCam = new BABYLON.ArcRotateCamera("spaceCam", -Math.PI / 2,  Math.PI / 4, 320, BABYLON.Vector3.Zero(), scene);
    spaceCam.attachControl(canvas);
    space.camera = spaceCam;

    var light = new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(0, 0, -1), scene);

    let skydome = new BABYLON.MeshBuilder.CreateSphere('skydome', { diameter: 5000 }, scene);
    let axis = new BABYLON.Vector3(0,0,1);
    skydome.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(axis, Math.PI / 2);

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
    space.ball = ball;
    ball.position.y = 40;
    ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);

    let ballMat = new BABYLON.StandardMaterial('earthmat', scene);
    ballMat.emissiveTexture = new BABYLON.Texture('textures/space-rock.jpg', scene);
    ball.material = ballMat;
    
    // create earth
    let earth = new BABYLON.MeshBuilder.CreateSphere('earth', { diameter: 50 }, scene);
    let earthmat = new BABYLON.StandardMaterial('earthmat', scene);
    earthmat.emissiveTexture = new BABYLON.Texture('textures/earth.jpg', scene);
    earth.material = earthmat;
    // rotate earth so that it aint upside down
    //let axis = new BABYLON.Vector3(1,0,0);
    //earth.rotationQuaternion = new BABYLON.Quaternion.RotationAxis(axis, Math.PI);

    earth.physicsImpostor = new BABYLON.PhysicsImpostor(earth, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 0, restitution: 0.9 }, scene);

    space.earth = earth;

    // calculate keplerian orbit
    let center = earth.position;

    let orbitElems = keplerElems(new BABYLON.Vector3(190, 10, 0), ball.position, center, 1000000);
    let orbitPoints = computeOrbit(center, orbitElems, 200);

    space.orbitalLines = [];
    for (let i = 0; i < orbitPoints.length - 1; i++) {
        let line = BABYLON.MeshBuilder.CreateLines('orbit' + i, {points: [orbitPoints[i], orbitPoints[i+1]]}, scene);
        line.color = BABYLON.Color3.Green();
        space.orbitalLines.push(line);
    }

    // make ball move on da rails of the orbit points
    let orbitFunc = runOrbit(ball, earth.position, orbitPoints, orbitElems, scene);

    // cannon import
    BABYLON.SceneLoader.ImportMesh("", "cannon/", "cannon.babylon", scene, function (meshes, particles, skeletons) {          
        Cannon.space = {};

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
        Cannon.space.Meshes = meshes;
        Cannon.space.CannonNode = cannonNode;
        Cannon.space.TubeNode = tubeNode;
        Cannon.space.TubeVec = tubeVec;
        Cannon.space.TubeRotV = tubeRotV;

        Cannon.space.Ball = meshes[3];
        // detach ball parent
        Cannon.space.Ball.parent = null;

        // give the ball physics
        Cannon.space.Ball.physicsImpostor = new BABYLON.PhysicsImpostor(Cannon.space.Ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
    });

    return scene;
}

//let sceneO = { earthScene: createEarthScene(), spaceScene: createSpaceScene(), earth: {cannon, camera}, space }; // pack up required refs
//sceneO.scene = sceneO.earthScene;
let sceneO = {};
function setupOrbitScenes() {
    sceneO.earthScene = createEarthScene();
    //console.log(sceneO.earthScene);
    sceneO.spaceScene = createSpaceScene();
    sceneO.earth = {cannon, camera};
    //sceneO.space = space;
    //sceneO = { earthScene: createEarthScene(), spaceScene: createSpaceScene(), earth: {cannon, camera}, space };
    sceneO.scene = sceneO.earthScene;
}

/*engine.runRenderLoop(function() {
    sceneO.scene.render();
});

window.addEventListener('resize', () => {
    engine.resize();
});*/

// gui stuff
function setupGUI() {
    sceneO.earth.cannon = cannon;
    sceneO.earth.camera = camera;

    sceneO.space = space;

    let ui = document.getElementById('ui');
    // shit for gui change
    let handI = 0;
    function nextBtnHandler() { // next button response handle, change shit on screen
        removeElems(ui);
        handI++;
        handlers[handI](ui, nextBtnHandler, sceneO);
    }
    handlers[handI](ui, nextBtnHandler, sceneO);

    debugCallback = () => {
        let count = 20;
        for (let i = 0; i < count; i++) {
            nextBtnHandler();
        }
    }

    //setTimeout(debugCallback, 500);
}