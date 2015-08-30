/**
 * @description RANSAC for lines
 * @param {pixel} pixels array of pixels on which the ransac will run
 * @param {int} epsilon dimension of the epsilon neighbourhood
 * @param {int} runs number of runs
 */
function lineRANSAC(pixels, epsilon, runs) {
    

    clearLayer(resultLayerContext);
    clearLayer(actLayerContext);
    clearLayer(epsLayerContext);
    
    INLIER = 0;
    BEST_INLIER = 0;
    var a, b, q, p, l, m, b;

    for (var r = 0; r < runs; r++) {

        

        //select two points randomly
        a = Math.floor((Math.random() * pixels.length));
        
        b = Math.floor((Math.random() * pixels.length));

        p = new Point(pixels[a].point.x, pixels[a].point.y);
        q = new Point(pixels[b].point.x, pixels[b].point.y);
        //draw line between these two points until borders are reached
        l = new Line(p, q);
        m = calcSlope(l);
        b = calcIntercept(l, m);
        calcLinePoints(l, m, b);


        //evaluate epsilon neighbourhood
        var pixHandle;
        for (var j = 0; j < pixels.length; j++) {
            pixHandle = pixels[j];

            var d = distancePointToLine(pixHandle.point, l);
            
            if (d <= epsilon) {
                INLIER++;

            }
        }
        //show points in neighbourhood + count
        //set best line


        if (INLIER > BEST_INLIER) {
            BEST_INLIER = INLIER;
            BEST_LINE = l;

        }
        INLIER = 0;
        // $output.val(out);
    }


}

/**
 * @description RANSAC for circles
 * @see http://www.ambrsoft.com/TrigoCalc/Circles2/Circle2.htm
 * @param {array<Point>} pixels data set on which the algorithm should run
 * @param {Number} epsilon epsilon neighborhood
 * @param {Number} runs how many hypotheses shall be tested
 */
function circleRANSAC(pixels, epsilon, runs) {
    clearLayer(resultLayerContext);
    clearLayer(actLayerContext);
    clearLayer(epsLayerContext);
    
    INLIER = 0;
    BEST_INLIER = 0;
    var a, b, c, x, y, z,currCircle, cross;

    for (var r = 0; r < runs; r++) {
            //      highlightText(1);
            var p,q,z;
            INLIER=0;
            do{
            a = Math.floor((Math.random() * pixels.length));
            b = Math.floor((Math.random() * pixels.length));
            c = Math.floor((Math.random() * pixels.length));
            
            p=new Point(pixels[a].point.x, pixels[a].point.y);
            q=new Point(pixels[b].point.x, pixels[b].point.y);
            z=new Point(pixels[c].point.x, pixels[c].point.y);
        }
        while((a===b)&&(a===c)&&(b===c)||((calculate2DDeterminate(p,q)===0)||(calculate2DDeterminate(p,z)===0)||(calculate2DDeterminate(q,z)===0)))
            
            
            var randPoints = {pA: new Point(pixels[a].point.x, pixels[a].point.y), pB: new Point(pixels[b].point.x, pixels[b].point.y), pC: new Point(pixels[c].point.x, pixels[c].point.y)};

            step_dXY = distancePointToPoint(randPoints.pA, randPoints.pB);
            step_dXZ = distancePointToPoint(randPoints.pA, randPoints.pC);
            step_dYZ = distancePointToPoint(randPoints.pB, randPoints.pC);

            var xy = new Circle(randPoints.pA.x, randPoints.pA.y, step_dXY * 0.6);
            var yx = new Circle(randPoints.pB.x, randPoints.pB.y, step_dXY * 0.6);

            step_XY = getCircleIntersectionLine(xy, yx);
            step_XY.m = calcSlope(step_XY);
            step_XY.b = calcIntercept(step_XY, step_XY.m);
            calcLinePoints(step_XY, step_XY.m, step_XY.b);

            var xz = new Circle(randPoints.pA.x, randPoints.pA.y, step_dXZ * 0.6);
            var zx = new Circle(randPoints.pC.x, randPoints.pC.y, step_dXZ * 0.6);

            step_XZ = getCircleIntersectionLine(xz, zx);
            step_XZ.m = calcSlope(step_XZ);
            step_XZ.b = calcIntercept(step_XZ, step_XZ.m);
            calcLinePoints(step_XZ, step_XZ.m, step_XZ.b);


            cross = getLineIntersection(step_XY, step_XZ);

            var temp_dist = distancePointToPoint(cross, randPoints.pA);
            currCircle = new Circle(cross.x, cross.y, temp_dist);
   
            for (var i = 0; i < pixels.length; i++) {
                var pixHandle = pixels[i];
                var d = distancePointToPoint(pixHandle.point, cross);
//                        

                if ((d < parseFloat(currCircle.r)+parseFloat(epsilon))&&(d>=currCircle.r)) {
                    INLIER++;
                }
            }
            updateWatchdog(BEST_INLIER, INLIER);
            if (INLIER > BEST_INLIER) {
                BEST_INLIER = INLIER;
                BEST_CIRCLE = currCircle;
                updateWatchdog(BEST_INLIER, INLIER);
                
            }

    }
}

