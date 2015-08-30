/**
 * @description represents a pixel
 * @param {int} red value of red part
 * @param {int} green value of green part
 * @param {int} blue value of blue part
 * @param {int} alpha opacity
 * 
 */
function Pixel(red, green, blue, alpha, x, y) {
    /**
     * @private red component
     * */ this.red = red;
    /**
     * @private green component
     * */this.green = green;
    /**
     * @private blue component
     * 
     * */this.blue = blue;
    /**
     * @private opacity
     * */this.alpha = alpha;
    /**
     * @private coordinates of Pixel
     * 
     * */this.point = new Point(x, y);
    /**@private @override*/this.toString = function() {
        return "[" + this.red + "," + this.green + "," + this.blue + "," + this.alpha + "]";
    };
}
/**
 * @description represents a point
 * @param {int} x  x component
 * @param {int} y  y component
 * */
function Point(x, y) {
    /**@private*/ this.x = x;
    /**@private*/ this.y = y;
}
/**
 * @description calculates the slope of a line
 * @param {line} line line object
 * @return {float} slope of the line object
 * */
function calcSlope(line) {
    if (line.p.x === line.q.x) {
        return 0;
    }
    else {
        var l = 0;
        var h = 0;
        if (line.p.x < line.q.x) {
            l = line.p;
            h = line.q;
        }
        else {
            l = line.q;
            h = line.p;
        }
        line.m = (h.y - l.y) / (h.x - l.x);
        return (h.y - l.y) / (h.x - l.x);
    }
}

/**
 * @description represents a line
 * 
 * @param {point} p starting point of line
 * @param {point} q end point of line
 * */
function Line(p, q) {
    /**@private*/ this.p = p;
    /**@private*/ this.q = q;
    /**@private*/ this.coordinates = [];
    /***/this.normal = 0;
    /***/this.m = 0;
    /***/this.b = 0;
}

/**
 * @description calculates the intercept of a line
 * 
 * @param {line} line line object
 * @param {float} m slope of the line object
 * @return {float} intercept point b
 * */
function calcIntercept(line, m) {
    if (m === 0) {

        return line.p.x;
    }
    else {

        line.b = (line.p.y - m * line.p.x);
        return (line.p.y - m * line.p.x);
    }
}

/**
 * @description calculates the points of a line
 * @param {line} line line object
 * @param {float} m slope of line
 * @param {float} b intercept of line
 * */
function calcLinePoints(line, m, b) {
    for (var x = 0; x <= width; x++) {
        var y = m * x + b;

        line.coordinates.push(new Point(Math.round(x), Math.round(y)));
    }
}
/**
 * @description represents a circle
 * @param {Point} x x component of center point
 * @param {Point} y y component of center point
 * @param {Number} r radius of circle
 * */
function Circle(x, y, r) {
    /**
     * @private center point
     * */ this.m = new Point(x, y);
    /**
     * @private radius of circle
     * */ this.r = r;
}
/**
 * @description gets intersection lines between two intercepting circles
 * @version SIMPLE VERSION for RANSAC
 * @see http://www.sonoma.edu/users/w/wilsonst/papers/Geometry/circles/default.html
 * @param {circle} circA first circle
 * @param {circle} circB second circle
 * @returns {line} intersection line through the intersection points
 * */
function getCircleIntersectionLine(circA, circB) {
    var d = distancePointToPoint(circA.m, circB.m);
    var x1 = (circB.m.x + circA.m.x) / 2 + (circB.m.y - circA.m.y) / d * Math.pow((4 * Math.pow(circA.r, 2) - Math.pow(d, 2)), 0.5);
    var x2 = (circB.m.x + circA.m.x) / 2 - (circB.m.y - circA.m.y) / d * Math.pow((4 * Math.pow(circA.r, 2) - Math.pow(d, 2)), 0.5);
    var y1 = (circB.m.y + circA.m.y) / 2 - (circB.m.x - circA.m.x) / d * Math.pow((4 * Math.pow(circA.r, 2) - Math.pow(d, 2)), 0.5);
    var y2 = (circB.m.y + circA.m.y) / 2 + (circB.m.x - circA.m.x) / d * Math.pow((4 * Math.pow(circA.r, 2) - Math.pow(d, 2)), 0.5);

    return new Line(new Point(x1, y1), new Point(x2, y2));
}

/**
 * @description gets shortest distance beween a point and a line(segment)
 * @param {point} point point which distance to the line should be calculated
 * @param {line} line line from which the distance to the point should be calculated
 * @see http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
 * 
 * @return {Number} shortest distance between point and line
 * */
/*function distancePointToLine(point, line) {
 var p = line.coordinates[0];
 var q = line.coordinates[line.coordinates.length - 1];
 var laneLength = distancePointToPoint(p, q);
 if (laneLength === 0) {
 return distancePointToPoint(point, p);
 }
 
 var m = ((point.x - p.x) * (q.x - p.x) + (point.y - p.y) * (q.y - p.y)) / laneLength;
 
 if (m < 0) {
 return distancePointToPoint(point, p);
 }
 if (m > 1) {
 return distancePointToPoint(point, q);
 }
 return distancePointToPoint(point, new Point(p.x + m * (q.x - p.x), p.y + m * (q.y - p.y)));
 
 }*/

function distancePointToLine(point, line) {

    var A = point.x - line.coordinates[0].x;
    var B = point.y - line.coordinates[0].y;
    var C = line.coordinates[line.coordinates.length - 1].x - line.coordinates[0].x;
    var D = line.coordinates[line.coordinates.length - 1].y - line.coordinates[0].y;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = dot / len_sq;

    var xx, yy;

    if (param < 0 || (line.coordinates[0].x === line.coordinates[line.coordinates.length - 1].x && line.coordinates[0].y === line.coordinates[line.coordinates.length - 1].y)) {
        xx = line.coordinates[0].x;
        yy = line.coordinates[0].y;
    }
    else if (param > 1) {
        xx = line.coordinates[line.coordinates.length - 1].x;
        yy = line.coordinates[line.coordinates.length - 1].y;
    }
    else {
        xx = line.coordinates[0].x + param * C;
        yy = line.coordinates[0].y + param * D;
    }

    var dx = point.x - xx;
    var dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);

}

/**
 * @description gets distance between two points
 * 
 * @param {Point} p first point
 * @param {Point} q second point
 * @return {Number} distance beween p and q
 * 
 * */
function distancePointToPoint(p, q) {
    return Math.pow(Math.pow(p.x - q.x, 2) + Math.pow(p.y - q.y, 2), 0.5);
}




/**
 * @description gets Line to Line Intersection
 * line1 : p 1 q 2
 * line2 : p 3 q 4
 * @see http://en.wikipedia.org/wiki/Line-line_intersection
 * @param {line} line1 first line
 * @param {line} line2 second line
 * @return {point} intersection point
 * */
function getLineIntersection(line1, line2) {
    var p1 = line1.coordinates[0];
    var q1 = line1.coordinates[line1.coordinates.length - 1];
    var p2 = line2.coordinates[0];
    var q2 = line2.coordinates[line2.coordinates.length - 1];
    var denominator = (p1.x - q1.x) * (p2.y - q2.y) - (p1.y - q1.y) * (p2.x - q2.x);
    var a = (p1.x * q1.y - p1.y * q1.x);
    var b = (p2.x * q2.y - p2.y * q2.x);
    return new Point((a * (p2.x - q2.x) - (p1.x - q1.x) * b) / denominator, (a * (p2.y - q2.y) - (p1.y - q1.y) * b) / denominator);
}

function normalizeVector(point) {
    pLength = getLength(point);
    return new Point(point.x / pLength, point.y / pLength);
}
/**
 * @description gets normal vector to a line
 * @param {Line} line line
 * */
function getNormalVector(line) {
    var p = new Point(line.m, -1);

    line.normal = normalizeVector(p);
}

/**
 * @description gets length of a point (vector)
 * @param {Point} point vector 
 * */
function getLength(point) {
    return Math.pow(Math.pow(point.x, 2) + Math.pow(point.y, 2), 0.5);
}


/**
 * @description draws Point as an +
 * @param {Point} point which point should be drawn
 * @param {String} color determines the color
 * @param {CanvasContext} ctx on which canvas should be drawn
 * */
function drawPoint(point, color, ctx) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(point.x - 1, point.y, 2, 2);
    ctx.fillRect(point.x + 1, point.y, 2, 2);
    ctx.fillRect(point.x, point.y, 2, 2);
    ctx.fillRect(point.x, point.y - 1, 2, 2);
    ctx.fillRect(point.x, point.y + 1, 2, 2);
    ctx.restore();
}

/**
 *@description draws Line
 *@param {Line} line which line should be drawn
 *@param {String} color determines the color
 *@param {CanvasContext} ctx on which canvas should be drawn
 * */
function drawLine(line, color, ctx) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(line.coordinates[0].x, line.coordinates[0].y);
    ctx.lineTo(line.coordinates[line.coordinates.length - 1].x, line.coordinates[line.coordinates.length - 1].y);
    ctx.stroke();
    ctx.restore();
}

/**
 * @description connects two points
 * @param {Point} p first point
 * @param {Point} q second point
 * @param {String} color determines the color
 * @param {CanvasContext} ctx on wich canvas should be drawn
 * */
function connectPoints(p, q, color, ctx) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(q.x, q.y);
    ctx.stroke();
    ctx.restore();
}

/**
 * @description draws Circle
 * @param {Circle} circle which circle should be drawn
 * @param {String} color determines the color
 * @param {CanvasContext} ctx determines on wich canvas should be drawn
 * */
function drawCircle(circle, color, ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(circle.m.x, circle.m.y, circle.r, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.restore();
}

/**
 * @description draws epsilon neighborhood for lines
 * @param {Line} line line for which the neighborhood shall be drawn
 * @param {String} color determines color
 * @param {CanvasContext} ctx determines on which canvas shall be drawn
 * */
function drawLineEpsilon(line, color, ctx) {
    ctx.save();
    getNormalVector(line);
    var end = line.coordinates.length - 1;
    ctx.beginPath();
    ctx.moveTo(line.coordinates[end].x + (epsilon * line.normal.x), line.coordinates[end].y + (epsilon * line.normal.y));
    ctx.lineTo(line.coordinates[end].x - (epsilon * line.normal.x), line.coordinates[end].y - (epsilon * line.normal.y));
    ctx.lineTo(line.coordinates[0].x - (epsilon * line.normal.x), line.coordinates[0].y - (epsilon * line.normal.y));
    ctx.lineTo(line.coordinates[0].x + (epsilon * line.normal.x), line.coordinates[0].y + (epsilon * line.normal.y));
    ctx.closePath();


    ctx.globalAlpha = 0.2;
    ctx.fillStyle = color;
    ctx.fill();

    ctx.restore();
}

/**
 * @description draws an example image on canvas
 * @param {CanvasContext} ctx determines on which canvas shall be drawn
 * @param {String} color determines color
 * */
function drawExample(ctx, color) {
    var mx = width / 2;
    var my = height / 2;
    var r = 100;

    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([20]);
    ctx.arc(mx, my, r, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.stroke();


    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.setLineDash([40]);
    ctx.moveTo(mx - 150, my + 150);
    ctx.lineTo(mx + 150, my - 150);
    ctx.stroke();

    ctx.restore();
}

/**
 * @description draws an example circle image on canvas
 * @param {Number} no selection variable
 * @param {CanvasContext} ctx determines on which canvas shall be drawn
 * @param {String} color determines color
 * */
function drawCircleExample(ctx, color) {
    //random circles

    var mx;
    var my;
    var r;
    ctx.save()

    for (var i = 0; i < 8; i++) {
        mx = Math.random() * width;
        my = Math.random() * height;
        r = Math.random() * height;

        ctx.beginPath();
        ctx.setLineDash([i % 11]);
        ctx.arc(mx, my, r, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    ctx.restore();

}

/**
 * @description draws an example line image on canvas
 * @param {CanvasContext} ctx determines on which canvas shall be drawn
 * @param {String} color determines color
 * */
function drawLineExample(ctx, color) {
    //random lines
    ctx.save();
    ctx.strokeStyle = color;
    for (var i = 0; i < 21; i++) {
        var x1 = Math.random() * width;
        var y1 = Math.random() * height;
        var x2 = Math.random() * width;
        var y2 = Math.random() * height;

        ctx.setLineDash([i % 11]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    ctx.restore();

}

/**
 * @description clears canvas
 * 
 * @param {CanvasContext} ctx canvas context
 * */
function clearLayer(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * @description draws epsilon neighborhood for respective circle
 * 
 * @param {Circle} circle respective circle
 * @param {String} color color in which epsilon neighborhood should be displayed
 * @param {CanvasContext} ctx determines on which canvas should be drawn on 
 * */
function drawCircleEpsilon(circle, color, ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(circle.m.x, circle.m.y, circle.r + parseFloat(epsilon / 2), 0, 2 * Math.PI);
    ctx.arc(circle.m.x, circle.m.y, circle.r - parseFloat(epsilon / 2), 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = epsilon;
    ctx.globalAlpha = 0.2;
    ctx.stroke();
    ctx.restore();
}

function calculate2DDeterminate(p, q) {
    return p.x * q.y - p.y * q.x;
}

/**
 * @description gets normal vector of line which lies left from it's direction
 * @param {Line} line Line
 * @return {Line} left lying normal vector of line
 * */
function getLeftNormal(line) {
    var n = new Point(line.coordinates[line.coordinates.length - 1].y, -line.coordinates[line.coordinates.length - 1].x);
    if (vectorSide(line.coordinates[line.coordinates.length - 1], n) < 0) {
        return n;
    }
    else {
        return new Point(-line.coordinates[line.coordinates.length - 1].y, line.coordinates[line.coordinates.length - 1].x);
    }
}

/**@description gets on which side of p q lies
 * @param {Point} p first vector
 * @param {Point} q second vector
 * @return {Number} <0: q left of p; >0 q right of q; =0 q parallel/antiparallel to p
 * */
function vectorSide(p, q) {

    return p.x * (-q.y) + p.y * q.x;
}
