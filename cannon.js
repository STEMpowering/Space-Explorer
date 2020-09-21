// represents a cannon huyhn
class Cannon {
    static startAngle = 5;
    static scale = 6;
    static tubeParts = new Set([5, 2, 16, 13, 14, 15, 9, 1, 12]);

    constructor(scene, space) {
        if (space) {
            this.scene = scene;

            this.node = Cannon.space.CannonNode.clone();
            this.tubeNode = Cannon.space.TubeNode.clone();
            this.ball = Cannon.space.Ball.clone();

            // ball physics
            //this.ball.physicsImpostor = new BABYLON.PhysicsImpostor(this.ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);

            this.tubeRotV = new BABYLON.Vector3(); this.tubeRotV.copyFrom(Cannon.space.TubeRotV);
            this.tubeVec = new BABYLON.Vector3(); this.tubeVec.copyFrom(Cannon.space.TubeVec);
            this.tubeRotV.parent = this.node;
            this.tubeVec.parent = this.node;

            this.tubeNode.parent = this.node;
            this.ball.parent = this.node;

            this.node.setEnabled(true);
            this.ball.setEnabled(false);

            return;
        }

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
    fire(speed, dontSetBall) {
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

        if (!dontSetBall) {
            let ballVelocity = this.tubeVec.multiplyByFloats(speed, speed, speed);
            this.ball.physicsImpostor.setLinearVelocity(ballVelocity);
        }
        // fire the ball
        // first correct its position into cannon coordinates
        this.ball.parent = this.node;
        this.ball.position = this.tubeVec.multiplyByFloats(1.75,1.75,1.75);
        if (dontSetBall) {
            //this.ball.position = this.ball.position.multiplyByFloats(0.5,0.5,0.5);
            let worldMat = this.ball.computeWorldMatrix(true);
            this.ball.position = BABYLON.Vector3.TransformCoordinates(this.ball.position, worldMat);
            this.ball.parent = null;
            //this.ball.scaling = new BABYLON.Vector3(2,2,2);
        }
        
        this.ball.setEnabled(true);

        return anim;
    }
}