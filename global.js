/**
 * @public textarea element
 */
var $output;
/**
 * @public minimum width for canvas
 * */
var CANVAS_MIN = 500;
/***/
var CANVAS_SIZE=0.5;
/**
 * @public minimum for epsilon neighborhood for stepwiseCircleRANSAC
 * */
var step_epsilonMin;
/**
 * @public maximum for epsilon neighborhood for stepwiseCircleRANSAC
 * */
var step_epsilonMax;
/**
 * @public bool should the algorithm run stepwise? 
 * */
var STEPWISE;
/**
 * @public int epsilon neighbourhood
 * */
var epsilon;
/**
 * @public int how many hypotheses shall be tested?
 * */
var runs = 0;
/**
 * @public data set on which the ransac shall run
 * */
var canvas_points = new Array();//double array
/**
 * @public best fitting line found
 * */
var BEST_LINE = 0;// = new line(new Point(0, 0), new Point(0, 0), []);

/**
 * @public amount of points in epsilon neighbourhood around best line
 * */
var BEST_INLIER=0;

/**
 * @public best fitting circle found
 * */
var BEST_CIRCLE=0;//=new circle(0,0,0);

/**
 * @pubic bool shall the algorithm look for circles?
 * */
var circle;

/** 
 * @public minimum Radius of circles that shall be found
 *  */
var minRadius=1;

/** 
 * * @public minimum Radius of circles that shall be found  
 * */
var maxRadius=50;
/** 
 * * @public was mouse pressed? (event handling for canvas drawing) 
 * */
var mousePressed = false;

/** 
 * * @public last x and y coordinates of mouse (event handling for canvas drawing)
 * */
var lastX, lastY;
/**
 * @public int stores width and height 
 * */
var width, height;

/**
 * @public variable to store the amount of inlying points found
 * */
var INLIER;

/**
 * @public bool shall exrapolation be used to speed up?
 * */
var extrapolation;

/**
 * @public stores which language is displayed
 * */
var LANG;
/** 
 *  @public Canvas for data of the actual run
 *  */
var actCanvas;
/** 
 *  @public  Canvas for background data (where is drawn on)
 * */
var bgCanvas;

/** 
 * * @public Canvas for results 
 * */
var resultCanvas;
/** 
 *  @public  Canvas for displaying the epsilon neighborhood
 * */
var epsCanvas;

/**
 * @public stores which steps were made
 * */
var stepCount;

/**
 * @public stores how many loops have been calculated (for user info)
 * */
var stepLoop=0;

/** 
 * * @public stores in which step user is in while stepwise execution
 * */
var stepPixels;

/** 
 * * @public temporary line for stepLineRANSAC
 * */
var stepL;

/** 
 * * @public  slope for temporary line for stepLineRANSAC
 * */
var stepM;
/** 
 *  @public  interception for temporary line for stepLineRANSAC
 * */
var stepB;
/**
 * @public distance between first and second random circle center
 * */
var step_dXY;

/**
 * @public distance between first and third random circle center
 * */
var step_dXZ;

/**
 * @public distance between second and third random circle center
 * */
var step_dYZ;

/**
 * @public interception line between first and second circle for stepCircleRANSAC
 * */
var step_XY;
/**
 * @public interception line between first and third circle for stepCircleRANSAC
 * */
var step_XZ;

/**
 * @public interception line between second and third circle for stepCircleRANSAC
 * */
var step_YZ;

/**
 * @public interception point of lines which connect interceptions of random circles
 * */
var step_cross;

/**
 * @public
 * */
var step_radCount=0;

///**
// * @public temporary 
// * */
//var step_tempCircle;


/**
 * @public random circle hypothesis #1
 * */
var step_x;

/**
 * @public random circle hypothesis #2
 * */
var step_y;

/**
 * @public random circle hypothesis #3
 * */
var step_z;


/** 
 *  @public input data set for stepwise RANSAC functions
 * */
var step_randPoints;

/** 
 *  @public current hypothesis for stepwiseLineRANSAC
 * */
var step_currLine;

/** 
 *  @public current hypothesis for stepwiseCircleRANSAC
 * */
var step_currCircle;

///** 
// * @public  
// * */
//var step_currEpsPoints;

/** 
 *  @public canvas context for background layer  
 *  */
var backgroundLayerContext;
/** 
 * @public  canvas context for result layer
 *  */
var resultLayerContext;
/** 
 *  @public  canvas context for result layer
 *  */
var actLayerContext;
/** 
 *  @public  canvas context for result layer
 * */
var epsLayerContext;

