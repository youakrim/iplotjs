var canvas = document.getElementById('plot');
var context = canvas.getContext("2d");

plot_padding = 30;

// Coordinate system

plot_size = {'width': 700,
             'height':600};

origin_val = {'x':0,
                'y':0};

origin_pos = {'x':plot_padding,
                   'y':plot_padding + plot_size.height};

max_val = {'x':700,
           'y': 500};

max_pos = {'x':plot_size.width+plot_padding,
                'y':plot_padding};


points = [[20,264],[100,247], [230,270], [280,300],[340,250], [460,302], [600,312], [699,254]];

function drawContours(){
  // Draw left and top contours
  // Top contour
  context.beginPath();
  context.setLineDash([]);
  context.moveTo(origin_pos.x, max_pos.y);
  context.lineTo(max_pos.x, max_pos.y);
  context.lineWidth = 1;
  context.strokeStyle = '#AEAEB1';
  context.stroke();

  // Left contour
  context.beginPath();
  context.setLineDash([]);
  context.moveTo(origin_pos.x, origin_pos.y+10);
  context.lineTo(origin_pos.x, max_pos.y);
  context.lineWidth = 1;
  context.strokeStyle = '#AEAEB1';
  context.stroke();
}

function drawMainAxes(){
  // Draw axis
  // y
  context.beginPath();
  context.setLineDash([4, 4]);
  context.moveTo(max_pos.x, origin_pos.y+37);
  context.lineTo(max_pos.x, max_pos.y);
  context.lineWidth = 2;
  context.strokeStyle = '#E1E1E4';
  context.stroke();


  // x axis
  context.beginPath();
  context.moveTo(origin_pos.x, origin_pos.y);
  context.lineTo(max_pos.x, origin_pos.y);
  context.setLineDash([]);
  context.lineWidth = 2;
  context.strokeStyle = '#E1E1E4';
  context.stroke();
}

function drawIntermediateYAxes(){
  // Intermediate y axes
  // Generate artificial y axes
  var number_of_axes = 7;
  var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
            'august', 'september', 'october', 'november', 'december'];
  var x_labels = []
  axis_interval = plot_size.width / number_of_axes;
  for (var i=0;i<number_of_axes;i++){
    x_labels.push({'x':i*axis_interval, 'label':months[i].substring(0,3)+'.'})
  }

  // Draw y axes
  for (var i = 0; i < x_labels.length; i++){
    if (x_labels[i].x>5){
      context.beginPath();
      context.setLineDash([4, 4]);
      context.moveTo(origin_pos.x+x_labels[i].x, plot_padding+1);
      context.lineTo(origin_pos.x+x_labels[i].x, origin_pos.y+37);
      context.lineWidth = 2;
      context.strokeStyle = '#E1E1E4';
      context.stroke();
    }
    // Write label
    context.beginPath();
    context.font = "25px";
    context.font = "25px Helvetica";
    context.fillStyle = "#C3C3C5";
    context.textAlign = "left";
    context.fillText(x_labels[i].label, x_labels[i].x+9+origin_pos.x, origin_pos.y+32);
    context.stroke();
  }
}


function drawIntermediateXAxes(){
  // Intermediate x axes
  // Generate artificial x axes
  var number_of_axes = 3;
  var axis_interval = plot_size.height / number_of_axes ;
  // Draw x axes
  for (var i=0; i < number_of_axes;i++){
    if (origin_pos.y-axis_interval*i > max_pos.y){
      context.beginPath();
      context.moveTo(origin_pos.x, origin_pos.y-axis_interval*i);
      context.lineTo(max_pos.x-1, origin_pos.y-axis_interval*i);
      context.setLineDash([]);
      context.lineWidth = 2;
      context.strokeStyle = '#E1E1E4';
      context.stroke();
    }
  }
}

function scalePoints(points){
  var x,y;
  var points_to_disp = [];
  var x_val_range = max_val.x - origin_val.x;
  var y_val_range = max_val.y - origin_val.y;
  var x_pixel_scale = plot_size.width / x_val_range;
  var y_pixel_scale = plot_size.height / y_val_range;

  for (var i = 0; i<points.length;i++){

    x = points[i][0];
    y = points[i][1];

    // Check if the point in within bounds
    if (x > origin_val.x && x < max_val.x && y > origin_val.y && y < max_val.y){

      // Subtract the origin
      x = x - origin_val.x;
      y = y - origin_val.y;

      // Scale the point
      x = x * x_pixel_scale;
      y = y * y_pixel_scale;

      // Place the point
      x = origin_pos.x + x;
      y = origin_pos.y - y;

      // Add point to the list
      points_to_disp.push([x,y]);
    }
  }
  return points_to_disp;
}

function drawCurve(points_to_disp){

  // Draw lines
  var x_0,y_0,x_1,y_1;
  for(var i = 0; i<points_to_disp.length-1;i++){
    context.beginPath();
    x_0 = points_to_disp[i][0];
    y_0 = points_to_disp[i][1];
    x_1 = points_to_disp[i+1][0];
    y_1 = points_to_disp[i+1][1];

    context.moveTo(x_0, y_0);
    context.lineTo(x_1, y_1);
    context.lineWidth = 4;
    context.strokeStyle = '#A357D6';
    context.stroke();
  }

  // Draw points
  var x,y;
  for(var i = 0; i<points_to_disp.length;i++){
    context.beginPath();
    x = points_to_disp[i][0];
    y = points_to_disp[i][1];
    context.arc(x, y, 6, 0, 2 * Math.PI);
    context.fillStyle = 'white';
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = '#A357D6';
    context.stroke();
  }
}

drawContours();
drawMainAxes();
drawIntermediateYAxes();
drawIntermediateXAxes();
scaled_points  = scalePoints(points);
drawCurve(scaled_points);
