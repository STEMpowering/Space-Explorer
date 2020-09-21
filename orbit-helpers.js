
// compute needed keplers elements
// wraps all in object
const keplerElems = (velocity, satPos, centerPos, gravParam) => {
    // first get radial and tangential velocities
    let rV = satPos.subtract(centerPos);
    let rn = BABYLON.Vector3.Normalize(rV);

    // components
    let vr = BABYLON.Vector3.Dot(rn, velocity);
    let vt = Math.sqrt( velocity.lengthSquared() - vr * vr );
    let r = rV.length();

    // finding normal of orbital plane
    let vrV = rn.multiplyByFloats(vr, vr, vr);
    let vtV = velocity.subtract(vrV);
    let tn = BABYLON.Vector3.Normalize(vtV);
    let normal = BABYLON.Vector3.Cross( tn, rn );

    let mu = gravParam; // standard gravitational parameter
    let radMul = (velocity.lengthSquared() / mu - 1 / r);
    let velMul = BABYLON.Vector3.Dot(rV, velocity) / mu;
    let ecc = rV.multiplyByFloats(radMul, radMul, radMul); // eccentricity vector
    ecc = ecc.subtract(velocity.multiplyByFloats(velMul, velMul, velMul));

    let h = BABYLON.Vector3.Cross(rV, velocity); // angular momentum
    let E0 = velocity.lengthSquared() / 2 - mu / r; // energy

    let p = 0;
    let a = -1;
    if (ecc.length() == 1) { // special case
        p = h.lengthSquared() / mu;
    } else {
        // general p calculation
        a = -mu / (2 * E0);
        p = a * (1 - ecc.lengthSquared());
    }

    let theta = Math.acos(BABYLON.Vector3.Dot(ecc, rV) / (ecc.length() * rV.length()));

    return { eccV: ecc, normal: normal, p: p, a: a, theta: theta, E0: E0 };
}

// compute orbital points
const computeOrbit = (centerPos, orbitElems, segCount) => {
    let cosn = BABYLON.Vector3.Normalize(orbitElems.eccV);
    let sinn = BABYLON.Vector3.Cross(cosn, orbitElems.normal);

    let points = [];

    for (let i = 0; i <= segCount; i++) {
        let angle = -i * Math.PI * 2 / segCount - orbitElems.theta;

        let currentDist = orbitElems.p / (1 + orbitElems.eccV.length() * Math.cos(angle));
        let cos = Math.cos(angle) * currentDist;
        let sin = Math.sin(angle) * currentDist;
        
        let point = new BABYLON.Vector3(0,0,0);
        point.copyFrom(centerPos);

        let cosV = cosn.multiplyByFloats(cos, cos, cos);
        let sinV = sinn.multiplyByFloats(sin, sin, sin);

        point = point.add(cosV); point = point.add(sinV);

        points.push(point);
    }

    return points;
}

// compute speed based on total energy, and grav potential
const computeSpeed = (E0, gravParam, r) => {
    let velSqr = E0 + gravParam / r; velSqr *= 2;

    return Math.sqrt(velSqr);
}

// run an orbit based on points, and potential energy for speed
// return function needed to unregister
const runOrbit = (object, centerPos, rail, orbitElems, scene, speedParam) => {
    let currentPoint = 0;
    let nextPoint = 1;
    let delta = 0;
    const func = () => {
        let deltaT = scene.getEngine().getDeltaTime();

        let p1 = rail[currentPoint];
        let p2 = rail[nextPoint];

        // interpolation vectors
        let deltaR = p2.subtract(p1);
        let rn = BABYLON.Vector3.Normalize(deltaR);
        let r = deltaR.length();

        // compute speed
        let distV = object.position.subtract(centerPos);
        let dist = distV.length();
        let speed = computeSpeed(orbitElems.E0, 1000000, dist);
        if (speedParam) {
            speed *= speedParam;
        } else {
            speed *= .0008;
        }

        delta += speed * deltaT;

        while (delta > r) {
            delta -= r;

            currentPoint++;
            nextPoint++;
            if (nextPoint >= rail.length) {
                nextPoint = 0;
            }
            if (currentPoint >= rail.length) {
                currentPoint = 0;
            }

            p1 = rail[currentPoint];
            p2 = rail[nextPoint];

            deltaR = p2.subtract(p1);
            rn = BABYLON.Vector3.Normalize(deltaR);
            r = deltaR.length();
        }
        let position = rn.multiplyByFloats(delta, delta, delta);
        position = position.add(p1);
        object.position = position;
    };
    scene.registerBeforeRender(func);

    return func;
}