
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
        let angle = i * Math.PI * 2 / segCount + orbitElems.theta;

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