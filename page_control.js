/**
 * @author Danny Behnecke
 * @version 0.1
 * */



/**
 * sets initial values/options
 */
function init() {

    showEnglish();
    
    $('#pseudo_circle').hide();

    $("#actualLine_en").hide();
    $("#actualCircle_en").hide();
    $("#bestCircle_en").hide();
    $("#actualLine_de").hide();
    $("#actualCircle_de").hide();
    $("#bestCircle_de").hide();
    
    var doc = document;
    width = doc.getElementById('Background').width;
    height = doc.getElementById('Background').height;
    
  


    bgCanvas = $("#Background").get(0);
    backgroundLayerContext = bgCanvas.getContext("2d");

    resultCanvas = $("#Result").get(0);
    resultLayerContext = resultCanvas.getContext("2d");

    actCanvas = $("#CurrentRun").get(0);
    actLayerContext = actCanvas.getContext("2d");

    epsCanvas = $("#Epsilon").get(0);
    epsLayerContext = epsCanvas.getContext("2d");

    alignCanvasOptions();
    resizeCanvas();

    stepPixels = 0;

    $output = $("#output");
    $output.val("");
    stepCount = 0;


    $(document).ready(function() {
        $(window).resize(function() {
            resizeCanvas();
            alignCanvasOptions();
        });
    });


    //Canvas Listener
    $('#Result').mousedown(function(e) {
        mousePressed = true;
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
    });

    $('#Result').mousemove(function(e) {
        if (mousePressed) {
            Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);

        }
    });

    $('#Result').mouseup(function(e) {
        mousePressed = false;
    });
    $('#Result').mouseleave(function(e) {
        mousePressed = false;
    });

    $("#go[lang='de'],#go[lang='en']").on('click', runLineRANSAC);
    $("#clear_best_circle_de,#clear_best_circle_en,#clear_best_line_en,#clear_best_line_de").on('click',resetBest);
    $("#example_button_1").on('click',example1);
    $("#example_button_2").on('click',example2);
    $("#example_button_3").on('click',example3);

    $('#circle').change(function() {
        circle = $('#circle').is(':checked');
        STEPWISE = $('#STEPWISE').is(':checked');

        if (circle) {
            $('#pseudo_line').hide();
            $('#pseudo_circle').show();
            
        }

        if ($('#STEPWISE').is(':checked')) {
            $("#go[lang='de'],#go[lang='en']").off('click');
            $("#go[lang='de'],#go[lang='en']").on('click', stepwiseCircleRANSAC);
        }
        else {
            $("#go[lang='de'],#go[lang='en']").off('click');
            $("#go[lang='de'],#go[lang='en']").on('click', runCircleRANSAC);
        }
        setWatchdog(circle, STEPWISE);

    });

    $('#line').change(function() {
        circle = $('#circle').is(':checked');
        STEPWISE = $('#STEPWISE').is(':checked');
        

        if (circle) {
            $('#pseudo_line').hide();
            $('#pseudo_circle').show();
        }
        if ($('#line').is(':checked')) {
            $('#pseudo_circle').hide();
            $('#pseudo_line').show();
        }


        if ($('#STEPWISE').is(':checked')) {
            $("#go[lang='de'],#go[lang='en']").off('click');
            $("#go[lang='de'],#go[lang='en']").on('click', stepwiseLineRANSAC);
        }
        else {
            $("#go[lang='de'],#go[lang='en']").off('click');
            $("#go[lang='de'],#go[lang='en']").on('click', runLineRANSAC);
        }
        setWatchdog(circle, STEPWISE);

    });

    $('#STEPWISE').change(function() {

        $("#go[lang='en']").val("Next Step");
        $("#go[lang='de']").val("Nächster Schritt");
        circle = $('#circle').is(':checked');
        STEPWISE = $('#STEPWISE').is(':checked');


        if ($('#circle').is(':checked')) {
            $("#go[lang='de'],#go[lang='en']").off('click', runCircleRANSAC);
            $("#go[lang='de'],#go[lang='en']").on('click', stepwiseCircleRANSAC);
        }
        else {
            $("#go[lang='de'],#go[lang='en']").off('click', runLineRANSAC);
            $("#go[lang='de'],#go[lang='en']").on('click', stepwiseLineRANSAC);

        }
        setWatchdog(circle, STEPWISE);
    });

    $('#complete').change(function() {

        $("#go[lang='en']").val("Go");
        $("#go[lang='de']").val("Los");
        circle = $('#circle').is(':checked');
        STEPWISE = $('#STEPWISE').is(':checked');

        if ($('#line').is(':checked')) {
            $("#go[lang='de'],#go[lang='en']").off('click', stepwiseLineRANSAC);
            $("#go[lang='de'],#go[lang='en']").on('click', runLineRANSAC);
        }
        else {
            $("#go[lang='de'],#go[lang='en']").off('click', stepwiseCircleRANSAC);
            $("#go[lang='de'],#go[lang='en']").on('click', runCircleRANSAC);
        }
        setWatchdog(circle, STEPWISE);
    });
    
    /**
     * @description resets best values
     * */
    function resetBest() {
        updateWatchdog(0,INLIER);
        BEST_INLIER=0;
        BEST_LINE=0;
        BEST_CIRCLE=0;
    }

    /**
     * @description resizes the canvas elements on resize
     * */
    function resizeCanvas() {

        var width = Math.floor(parseInt(window.innerWidth) * CANVAS_SIZE);//former value: 0.382
        if(width<CANVAS_MIN){
            width=CANVAS_MIN;
        }
        var contextBuffer;
        
        
        contextBuffer = backgroundLayerContext.getImageData(0, 0, bgCanvas.getAttribute('height') - 1, bgCanvas.getAttribute('width') - 1);  
        bgCanvas.setAttribute('width', width);
        backgroundLayerContext.putImageData(contextBuffer, 0, 0);

        contextBuffer = resultLayerContext.getImageData(0, 0, resultCanvas.getAttribute('height') - 1, resultCanvas.getAttribute('width') - 1);
        resultCanvas.setAttribute('width', width);
        resultLayerContext.putImageData(contextBuffer, 0, 0);

        contextBuffer = actLayerContext.getImageData(0, 0, actCanvas.getAttribute('height') - 1, actCanvas.getAttribute('width') - 1);
        actCanvas.setAttribute('width', width);
        actLayerContext.putImageData(contextBuffer, 0, 0);

        contextBuffer = epsLayerContext.getImageData(0, 0, epsCanvas.getAttribute('height') - 1, epsCanvas.getAttribute('width') - 1);
        epsCanvas.setAttribute('width', width);
        epsLayerContext.putImageData(contextBuffer, 0, 0);
    }
    
    

    /**
     * @desciption sets the option area and canvas area on the same top offset
     * */
    function alignCanvasOptions() {
        var offset = $("div.canvasArea").offset().top;
        var diff = $("div.watchdog").offset().top - $("div.control_Area").offset().top;
        $("div.control_Area").offset({top: offset});
        $("div.watchdog").offset({top: ($("div.control_Area").offset().top + diff)});
    }


}
/**
 * reads out options from site
 * */
function getOptions() {
    circle = $('#circle').is(':checked');
    STEPWISE = $('#STEPWISE').is(':checked');
    epsilon = $('#epsilon_range').val();
    runs = $('#runs').val();
    extrapolation = $('#extrapolatoin').attr('checked') === true;
    maxRadius = $("#epsilonMax").val();
    minRadius = $("#epsilonMin").val();

}
/**
 * writes canvas content in the variable window_pixels
 * @return {array<Pixel>} sets the data set for RANSAC
 */
function getCanvasContent() {
    //get current options
    getOptions();
    //get what's on the drawing layer of the canvas stack
    var window_pixels = new Array();
    var doc = document;
    width = doc.getElementById('Background').width;
    height = doc.getElementById('Background').height;

    canvas_points = backgroundLayerContext.getImageData(0, 0, width, height);
    var content = canvas_points.data;
    var p = 0;
    var part_pixels = [];
    var red, blue, green, alpha;
    for (var i = 0, n = content.length; i < n; i += 4) {
        red = content[i];
        green = content[i + 1];
        blue = content[i + 2];
        alpha = content[i + 3];

        if (alpha !== 0) {
            var pointer = i / 4;
            var y = parseInt(pointer / width);
            var x = pointer - y * width;
            window_pixels.push(new Pixel(red, green, blue, alpha, x, y));
            if (p % 20 === 0) {
                part_pixels.push(new Pixel(red, green, blue, alpha, x, y));
            }
            p++;
        }
    }


    if (extrapolation) {
        return part_pixels;
    }
    else {
        return window_pixels;
    }

}

/**
 * runs complete LineRANSAC
 * */
function runLineRANSAC() {
    BEST_LINE = 0;
    var canvas_data = getCanvasContent();

    if (canvas_data.length) {
        lineRANSAC(canvas_data, epsilon, runs);

        resultLayerContext.setTransform(1, 0, 0, 1, 0, 0);
        resultLayerContext.clearRect(0, 0, resultLayerContext.canvas.width, resultLayerContext.canvas.height);

        if (BEST_LINE !== 0) {
            drawLine(BEST_LINE, 'red', resultLayerContext);
            updateWatchdog(BEST_INLIER);
        }
    }
    else {
        if (LANG === 'DE') {
            alert("Bitte zuerst Suchgrundlage zeichnen!");
        }
        if (LANG === 'EN') {
            alert("Please draw data set to search on first!");
        }
    }
}

/**
 * runs CircleRANSAC
 * */
function runCircleRANSAC() {
    BEST_CIRCLE = 0;
    var canvas_data = getCanvasContent();

    if (canvas_data.length) {

        circleRANSAC(canvas_data, epsilon, runs);

        resultLayerContext.setTransform(1, 0, 0, 1, 0, 0);
        resultLayerContext.clearRect(0, 0, resultLayerContext.canvas.width, resultLayerContext.canvas.height);

        if (BEST_CIRCLE !== 0) {
            drawCircle(BEST_CIRCLE, 'red', resultLayerContext);
            updateWatchdog(BEST_INLIER);
        }
    }
    else {
        if (LANG === 'DE') {
            alert("Bitte zuerst Suchgrundlage zeichnen!");
        }
        if (LANG === 'EN') {
            alert("Please draw data set to search on first!");
        }
    }

}

/**
 * switch to german
 * */
function showGerman() {
    LANG = 'DE';

    $("p[lang='de']").show();
    $("input[lang='de']").show();
    $("label[lang='de']").show();
    $("code[lang='de']").show();
    $("legend[lang='de']").show();
    $("p[lang='en']").hide();
    $("input[lang='en']").hide();
    $("label[lang='en']").hide();
    $("code[lang='en']").hide();
    $("legend[lang='en']").hide();

    circle = $('#circle').is(':checked');
    STEPWISE = $('#STEPWISE').is(':checked');

    setWatchdog(circle, STEPWISE);

}

/**
 * switch to english
 * */
function showEnglish() {
    $("p[lang='en']").show();
    $("input[lang='en']").show();
    $("label[lang='en']").show();
    $("code[lang='en']").show();
    $("legend[lang='en']").show();
    $("p[lang='de']").hide();
    $("input[lang='de']").hide();
    $("label[lang='de']").hide();
    $("code[lang='de']").hide();
    $("legend[lang='de']").hide();
    LANG = 'EN';
    circle = $('#circle').is(':checked');
    STEPWISE = $('#STEPWISE').is(':checked');
    setWatchdog(circle, STEPWISE);
}

/**
 * draws on canvas
 * @param {Number} x x coordinate
 * @param {Number} y y coordinate
 * @param {bool} isDown is mouse pressed?
 * */
function Draw(x, y, isDown) {
    if (isDown) {
        backgroundLayerContext.beginPath();
        backgroundLayerContext.strokeStyle = 'black';
        backgroundLayerContext.lineWidth = 1;
        backgroundLayerContext.lineJoin = "round";
        backgroundLayerContext.moveTo(lastX, lastY);
        backgroundLayerContext.lineTo(x, y);

        backgroundLayerContext.stroke();
        backgroundLayerContext.closePath();
    }
    lastX = x;
    lastY = y;
}

/**
 * @description handler function for example drawing
 * */
function example1(){
        drawExample(backgroundLayerContext,'black');
}

/**
 * @description handler function for example drawing
 * 
 * */
function example2(){
       drawLineExample(backgroundLayerContext,'black');
}

/***/
function example3(){
    drawCircleExample(backgroundLayerContext,'black');
}

/**
 * @description sets the watchdog labels
 * @param {bool} circle is circle checked?
 * @param {bool} stepwise is stepwise checked?
 * */
function setWatchdog(circle, stepwise) {

    if (circle) {
        if (stepwise) {//circle, stepwise
            if (LANG === "EN") {
                $("#actualLine_en").hide();
                $("#bestLine_en").hide();
                $('#clear_current_line_en').hide();
                $('#clear_best_line_en').hide();
                $("#actualCircle_en").show();               
                $("#bestCircle_en").show();
                $('#clear_current_circle_en').show();
                $('#clear_best_circle_en').show();

                $("#actualLine_de").hide();
                $("#actualCircle_de").hide();
                $("#bestLine_de").hide();
                $("#bestCircle_de").hide();
                $('#clear_current_line_de').hide();
                $('#clear_best_line_de').hide();
            }
            else {
                $("#actualLine_de").hide();
                $("#bestLine_de").hide();
                $('#clear_current_line_de').hide();
                $('#clear_best_line_de').hide();
                $("#actualCircle_de").show();           
                $("#bestCircle_de").show();
                $('#clear_current_circle_de').hide();
                $('#clear_best_circle_de').hide();
                

                $("#actualLine_en").hide();
                $("#bestLine_en").hide();
                $("#actualCircle_en").hide();              
                $("#bestCircle_en").hide();
                $('#clear_current_circle_en').hide();
                $('#clear_best_circle_en').hide();
            }
        }
        else {//circle complete
            if (LANG === "EN") {
                $("#actualLine_en").hide();
                $("#bestLine_en").hide();
                $('#clear_current_line_en').hide();
                $('#clear_best_line_en').hide();
                $("#actualCircle_en").hide();
                $("#bestCircle_en").show();
                $('#clear_current_circle_en').hide();
                $('#clear_best_circle_en').hide();
                

                $("#actualLine_de").hide();
                $("#bestLine_de").hide();
                $("#actualCircle_de").hide();              
                $("#bestCircle_de").hide();
                $('#clear_current_line_de').hide();
                $('#clear_best_line_de').hide();
                $('#clear_current_circle_de').hide();
                $('#clear_best_circle_de').hide();
            }
            else {
                $("#actualLine_de").hide();
                $("#bestLine_de").hide();
                $('#clear_current_line_de').hide();
                $('#clear_best_line_de').hide();
                $("#actualCircle_de").hide();
                $("#bestCircle_de").show();
                $('#clear_current_circle_de').hide();
                $('#clear_best_circle_de').hide();

                $("#actualLine_en").hide();
                $("#bestLine_en").hide();
                $("#actualCircle_en").hide();
                $("#bestCircle_en").hide();
                $('#clear_current_line_en').hide();
                $('#clear_best_line_en').hide();
                $('#clear_current_circle_en').hide();
                $('#clear_best_circle_en').hide();
                
            }
        }
    }
    else {//line stepwise
        if (stepwise) {
            if (LANG === "EN") {
                $("#actualLine_en").show();
                $("#bestLine_en").show();
                $("#actualCircle_en").hide();           
                $("#bestCircle_en").hide();
                $('#clear_current_line_en').show();
                $('#clear_best_line_en').show();
                $('#clear_current_circle_en').hide();
                $('#clear_best_circle_en').hide();

                $("#actualLine_de").hide();
                $("#bestLine_de").hide();
                $("#actualCircle_de").hide();              
                $("#bestCircle_de").hide();
                $('#clear_current_line_de').hide();
                $('#clear_best_line_de').hide();
                $('#clear_current_line_de').hide();
                $('#clear_best_line_de').hide();
            }
            else {
                $("#actualLine_de").show();
                $("#bestLine_de").show();
                $("#actualCircle_de").hide();           
                $("#bestCircle_de").hide();
                $('#clear_current_line_de').show();
                $('#clear_best_line_de').show();
                $('#clear_current_circle_de').hide();
                $('#clear_best_circle_de').hide();
               
                $("#actualLine_en").hide();
                $("#actualCircle_en").hide();
                $("#bestLine_en").hide();
                $("#bestCircle_en").hide(); 
                $('#clear_current_circle_en').hide();
                $('#clear_best_circle_en').hide();
                $('#clear_current_line_en').hide();
                $('#clear_best_line_en').hide();

            }
        }
        else {//line complete
            if (LANG === "EN") {
                $("#actualLine_en").hide();
                $("#bestLine_en").show();
                $("#actualCircle_en").hide();              
                $("#bestCircle_en").hide();
                $('#clear_current_line_en').hide();
                $('#clear_best_line_en').hide();
                $('#clear_current_circle_en').hide();
                $('#clear_best_circle_en').hide();

                $("#actualLine_de").hide();
                $("#bestLine_de").hide();
                $("#actualCircle_de").hide();       
                $("#bestCircle_de").hide();
                $('#clear_current_line_de').hide();
                $('#clear_best_line_de').hide();
                $('#clear_current_circle_de').hide();
                $('#clear_best_circle_de').hide();
            }
            else {
                $("#actualLine_de").hide();
                $("#bestLine_de").show();
                $("#actualCircle_de").hide();
                $("#bestCircle_de").hide();
                $('#clear_current_line_de').hide();
                $('#clear_best_line_de').hide();
                $('#clear_current_circle_de').hide();
                $('#clear_best_circle_de').hide();

                $("#actualLine_en").hide();
                $("#bestLine_en").hide();
                $("#actualCircle_en").hide();
                $("#bestCircle_en").hide();
                $('#clear_current_line_en').hide();
                $('#clear_best_line_en').hide();
                $('#clear_current_circle_en').hide();
                $('#clear_best_circle_en').hide();
            }
        }
    }

}

/**
 * @description Sets the respective values in the watchdog area
 * @param {Number} best best Circle or Line
 * @param {Number} actual current Circle or Line
 * */
function updateWatchdog(best,actual){
    if(arguments.length===1){
        if($("#circle").is(":checked")){
            $("#bestCircle_en").text("best Circle: "+best);
            $("#bestCircle_de").text("bester Kreis: "+best);
        }
        else{
            $("#bestLine_en").text("best Line: "+best);
            $("#bestLine_de").text("beste Gerade: "+best);
        }
    }
    if(arguments.length===2){
        if($("#circle").is(":checked")){
            $("#bestCircle_en").text("best Circle: "+best);
            $("#bestCircle_de").text("bester Kreis: "+best);
            $("#actualCircle_en").text("actual Circle: "+actual);
            $("#actualCircle_de").text("aktueller Kreis: "+actual);
        }
        else{
            $("#bestLine_en").text("best Line: "+best);
            $("#bestLine_de").text("beste Gerade: "+best);
            $("#actualLine_en").text("actual Line: "+actual);
            $("#actualLine_de").text("aktuelle Gerade: "+actual);
        }
    }
}

/**
 * @description highlights the respective row in pseudo code
 * 
 * @param {Number} order specifies which msg should be displayed
 * */
function highlightText(order) {

    switch (order) {
        case 0://lap count

            $("#pseudo_evaluate1,#pseudo_evaluate2,#pseudo_evaluate3").css('background-color', 'transparent');
            $("#pseudo_for_loop_line").css('background-color', 'yellow');
            $("#pseudo_for_loop_circle").css('background-color', 'yellow');
            break;
        case 1://random points
            $("#pseudo_for_loop_line").css('background-color', 'transparent');
            $("#pseudo_for_loop_circle").css('background-color', 'transparent');
            $("#randomPoints1,#randomPoints2").css('background-color', 'yellow');
            break;
        case 2://calc line
            $("#randomPoints1,#randomPoints2").css('background-color', 'transparent');
            $("#pseudo_calc_line,#pseudo_calc_circumCirc").css('background-color', 'yellow');
            break;
        case 3://found point count
            $("#pseudo_calc_line, #pseudo_calc_circumCirc").css('background-color', 'transparent');
            $("#pseudo_get_inliers_line,#pseudo_get_inliers_circle").css('background-color', 'yellow');
            break;
        case 4://display best found line
            $("#pseudo_get_inliers_line,#pseudo_get_inliers_circle").css('background-color', 'transparent');
            $("#pseudo_evaluate1,#pseudo_evaluate2,#pseudo_evaluate3").css('background-color', 'yellow');

            break;

        default:
            $("#pseudo_get_inliers,#pseudo_evaluate1,#pseudo_evaluate2,#pseudo_evaluate3,#pseudo_calc_line,#randomPoints1,#randomPoints2,#pseudo_for_loop_line,#pseudo_for_loop_circle").css('background-color', 'transparent');
            break;
    }


}

/**
 * clears every canvas and the 'working variables'
 * */
function clearCanvas() {
    // Use the identity matrix while clearing the canvas
    backgroundLayerContext.setTransform(1, 0, 0, 1, 0, 0);
    backgroundLayerContext.clearRect(0, 0, backgroundLayerContext.canvas.width, backgroundLayerContext.canvas.height);
    resultLayerContext.setTransform(1, 0, 0, 1, 0, 0);
    resultLayerContext.clearRect(0, 0, resultLayerContext.canvas.width, resultLayerContext.canvas.height);
    actLayerContext.setTransform(1, 0, 0, 1, 0, 0);
    actLayerContext.clearRect(0, 0, actLayerContext.canvas.width, actLayerContext.canvas.height);
    epsLayerContext.setTransform(1, 0, 0, 1, 0, 0);
    epsLayerContext.clearRect(0, 0, epsLayerContext.canvas.width, epsLayerContext.canvas.height);
    updateWatchdog(0, 0);
    highlightText(-1);
    BEST_LINE = 0;
    BEST_INLIER = 0;

    stepCount = 0;

}