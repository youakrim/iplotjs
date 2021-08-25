function JSPlot(points, width, height, min_interval_size = 50,
                max_interval_size = 150, max_x_val = 700, max_y_val = 400,
                plot_padding = 30, origin_x_val = 0, origin_y_val = 0){
  {
    this.canvas = document.createElement("canvas");
    this.canvas.style.zoom = 0.5;
    this.canvas.width = width*2;
    this.canvas.height = height*2;
    this.context = this.canvas.getContext('2d');
    this.context.scale(1,1);
    this.points = points;
    this.plot_padding = plot_padding;
    this.plot_size = {'width': this.canvas.width - this.plot_padding*2 - 40,
                      'height': this.canvas.height - this.plot_padding*2 - 20};
    this.origin_val = {'x':origin_y_val,
                    'y':origin_y_val};
    this.origin_pos = {'x': this.plot_padding,
                       'y': this.plot_padding + this.plot_size.height};
    this.max_val = {'x':max_x_val,
               'y': max_y_val};
    this.max_pos = {'x': this.plot_size.width + this.plot_padding,
                    'y': this.plot_padding};
    this.x_val_range = this.max_val.x - this.origin_val.x;
    this.y_val_range = this.max_val.y - this.origin_val.y;
    this.x_pixel_scale = this.plot_size.width / this.x_val_range;
    this.y_pixel_scale = this.plot_size.height / this.y_val_range;
    this.min_interval_size = min_interval_size*2;
    this.max_interval_size = min_interval_size*2;

    this.max_number_of_axes_x = Math.trunc(this.plot_size.width / this.min_interval_size);
    this.min_number_of_axes_x = Math.trunc(this.plot_size.width / this.max_interval_size);
    this.max_number_of_axes_y = Math.trunc(this.plot_size.height / this.min_interval_size);
    this.min_number_of_axes_y = Math.trunc(this.plot_size.height / this.max_interval_size);
  }

  this.x_axis_generator = new NumberAxisGenerator(this.origin_val.x,
                                                  this.max_val.x,
                                                  min_number_fo_axes = this.min_number_of_axes_x,
                                                  max_number_of_axes = this.max_number_of_axes_x);

  this.y_axis_generator = new NumberAxisGenerator(this.origin_val.y,
                                                  this.max_val.y,
                                                  min_number_fo_axes = this.max_number_of_axes_y,
                                                  max_number_of_axes = this.max_number_of_axes_y);

  this.drawContours = function(){
    // Draw left and top contours

    // Contour style
    this.context.beginPath();
    this.context.setLineDash([]);
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#AEAEB1';

    // Top contour
    this.context.moveTo(this.origin_pos.x, this.max_pos.y);
    this.context.lineTo(this.max_pos.x+70, this.max_pos.y);
    this.context.stroke();

    // Left contour
    this.context.strokeStyle = '#D5D5D7';
    this.context.moveTo(this.origin_pos.x, this.origin_pos.y+10);
    this.context.lineTo(this.origin_pos.x, this.max_pos.y);

    this.context.stroke();
  }

  this.drawMainAxes = function(){

    // Draw y axis
    // this.context.beginPath();
    // this.context.setLineDash([4, 4]);
    // this.context.moveTo(this.max_pos.x, this.origin_pos.y+37);
    // this.context.lineTo(this.max_pos.x, this.max_pos.y);
    // this.context.lineWidth = 2;
    // this.context.strokeStyle = '#E1E1E4';
    // this.context.stroke();


    // Draw x axis
    this.context.beginPath();
    this.context.moveTo(this.origin_pos.x, this.origin_pos.y);
    this.context.lineTo(this.max_pos.x, this.origin_pos.y);
    this.context.setLineDash([]);
    this.context.lineWidth = 2;
    this.context.strokeStyle = '#E1E1E4';
    this.context.stroke();
  }

  this.drawIntermediateXAxes = function(){

    // Draw vertical grid axes and label main x axis
    var axes = this.x_axis_generator.generate_axes();
    console.log(this.x_axis_generator);
    var x;
    var label;
    for (var i = 0; i < axes.length; i++){
      x = this.origin_pos.x+(axes[i].value-this.origin_val.x)*this.x_pixel_scale ;
      label = axes[i].label;
      // Check whether the axis is far enough from the main Y axis
      if (x > this.origin_pos.x+1 && x < this.max_pos.x-1){
        this.context.beginPath();
        this.context.setLineDash([4, 4]);
        this.context.moveTo(x, this.max_pos.y+1);
        this.context.lineTo(x, this.origin_pos.y+37);
        this.context.lineWidth = 2;
        if(axes[i].is_important == true){
          this.context.setLineDash([]);
        }
        this.context.strokeStyle = '#E1E1E4';
        this.context.stroke();
      }

      // Write axis label
      if(x + 70 < this.max_pos.x){
        this.context.beginPath();
        this.context.font = "25px Helvetica";
        this.context.fillStyle = "#C3C3C5";
        this.context.textAlign = "left";
        this.context.fillText(label,
                              x + 9,
                              this.origin_pos.y+32);
        this.context.stroke();
      }
    }
  }

  this.drawIntermediateYAxes = function(){
    // Draw y axes
    var axes = this.y_axis_generator.generate_axes();
    var scaled_interval = this.y_axis_generator.interval * this.y_pixel_scale ;
    var y;
    var label;
    for (var i=0; i < axes.length; i++){
      y = this.origin_pos.y-scaled_interval*i;
      label =  axes[i].label;

      this.context.beginPath();
      this.context.setLineDash([]);
      this.context.lineWidth = 2;
      this.context.strokeStyle = '#E1E1E4';
      this.context.moveTo(this.origin_pos.x, y);
      this.context.lineTo(this.max_pos.x-1, y);
      this.context.stroke();

      // Write axis label
      this.context.beginPath();
      this.context.font = "25px Helvetica";
      this.context.fillStyle = "#C3C3C5";
      this.context.textAlign = "left";
      this.context.fillText(label,
                            this.max_pos.x + 10,
                            y+5);
      this.context.stroke();
    }
  }

  this.scalePoints = function(points){
    var x,y;
    var points_to_disp = [];
    var closest_invisible_left_point = null;
    var closest_invisible_right_point = null;

    for (var i = 0; i < points.length; i++){

      x = points[i][0];
      y = points[i][1];

      // Check if the point in within bounds
      if (x > this.origin_val.x+3 && x < this.max_val.x && y > this.origin_val.y && y < this.max_val.y){

        // Subtract the origin
        x = x - this.origin_val.x;
        y = y - this.origin_val.y;

        // Scale the point
        x = x * this.x_pixel_scale;
        y = y * this.y_pixel_scale;

        // Place the point
        x = this.origin_pos.x + x;
        y = this.origin_pos.y - y;

        // Add point to the list
        points_to_disp.push([x,y]);

      }else if(x < this.origin_val.x+3){

        // Subtract the origin
        x = x - this.origin_val.x;
        y = y - this.origin_val.y;

        // Scale the point
        x = x * this.x_pixel_scale;
        y = y * this.y_pixel_scale;

        // Place the point
        x = this.origin_pos.x + x;
        y = this.origin_pos.y - y;

        closest_invisible_left_point = [x,y]

      }else if(x > this.max_val.x && closest_invisible_right_point == null){

        // Subtract the origin
        x = x - this.origin_val.x;
        y = y - this.origin_val.y;

        // Scale the point
        x = x * this.x_pixel_scale;
        y = y * this.y_pixel_scale;

        // Place the point
        x = this.origin_pos.x + x;
        y = this.origin_pos.y - y;

        closest_invisible_right_point = [x,y]
      }
    }
    if (closest_invisible_left_point != null && points_to_disp.length > 0){
      // Trim to the origin
      x = closest_invisible_left_point[0]
      y = closest_invisible_left_point[1]
      var next_point = points_to_disp[0];
      var l0 = next_point[0]-x;
      var l1 = next_point[0]-this.origin_pos.x;
      ratio = l1/l0;
      console.log('ratio '+ratio);
      x = this.origin_pos.x;
      y = (next_point[1])+(y-next_point[1])*ratio;
      closest_invisible_left_point = [x,y]
    }
    if (closest_invisible_right_point != null && points_to_disp.length > 0){
      // Trim to the origin
      x = closest_invisible_right_point[0]
      y = closest_invisible_right_point[1]
      var previous_point = points_to_disp[points_to_disp.length-1];
      var l0 = previous_point[0]-x;
      var l1 = previous_point[0]-this.max_pos.x;
      ratio = l1/l0;
      console.log('ratio '+ratio);
      x = this.max_pos.x;
      y = (previous_point[1])+(y-previous_point[1])*ratio;
      closest_invisible_right_point = [x,y]
    }
    return [points_to_disp,closest_invisible_left_point,closest_invisible_right_point];
  }

  this.drawCurve = function(){

    scaled_points  = this.scalePoints(this.points);
    points_to_disp = scaled_points[0];
    left_invisible_point  = scaled_points[1];
    right_invisible_point  = scaled_points[2];

    // Draw lines
    var x_0,y_0,x_1,y_1;
    if(left_invisible_point != null){
      points_to_disp.unshift(left_invisible_point);
    }
    if(right_invisible_point != null){
      points_to_disp.push(right_invisible_point);
    }
    for(var i = 0; i < points_to_disp.length-1; i++){
      this.context.beginPath();
      this.context.setLineDash([]);
      x_0 = points_to_disp[i][0];
      y_0 = points_to_disp[i][1];
      x_1 = points_to_disp[i+1][0];
      y_1 = points_to_disp[i+1][1];

      this.context.moveTo(x_0, y_0);
      this.context.lineTo(x_1, y_1);
      this.context.lineWidth = 5;
      this.context.strokeStyle = '#A357D6';
      this.context.stroke();
    }

    // Draw points
    var x,y;

    if(left_invisible_point != null){
      points_to_disp.shift();
    }
    if(right_invisible_point != null){
      points_to_disp.pop(right_invisible_point);
    }
    for (var i = 0; i < points_to_disp.length; i++){
      this.context.beginPath();
      x = points_to_disp[i][0];
      y = points_to_disp[i][1];
      this.context.arc(x, y, 7, 0, 2 * Math.PI);
      this.context.fillStyle = 'white';
      this.context.fill();
      this.context.lineWidth = 5;
      this.context.strokeStyle = '#A357D6';
      this.context.stroke();
    }
  }

  this.drawPlot = function(){
      this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
      this.drawContours();
      this.drawMainAxes();
      this.drawIntermediateYAxes();
      this.drawIntermediateXAxes();
      this.drawCurve();
  }

  // Setters and getters
  this.setOriginValueX = function(origin_val_x){
    this.origin_val.x = origin_val_x;
    this.x_val_range = this.max_val.x - this.origin_val.x;
    this.x_pixel_scale = this.plot_size.width / this.x_val_range;
    this.x_axis_generator.value_1 = this.origin_val.x;
    this.drawPlot();
  }
  this.getOriginValueX = function(origin_val_x){
    return this.origin_val.x;
  }
  this.setOriginValueY = function(origin_val_y){
    this.origin_val.y = origin_val_y;
    this.y_val_range = this.max_val.y - this.origin_val.y;
    this.y_pixel_scale = this.plot_size.height / this.y_val_range;
    this.y_axis_generator.value_1 = this.origin_val.y;
    this.y_axis_generator.value_1 = this.origin_val.y;
    this.drawPlot();
  }
  this.getOriginValueY = function(origin_val_y){
    return this.origin_val.y;
  }

  this.getMaxValueX = function(){
    return this.max_val.x;
  }
  this.setMaxValueX = function(max_val_x){
    this.max_val.x = max_val_x;
    this.x_val_range = this.max_val.x - this.origin_val.x;
    this.x_pixel_scale = this.plot_size.width / this.x_val_range;
    this.x_axis_generator.value_2 = this.max_val.x;
    this.drawPlot();
  }

  this.setXAxisGenerator = function(x_axis_generator){
    this.x_axis_generator = x_axis_generator;
    this.drawPlot();
  }

  this.drawPlot();

}

function Axis(value, label = null, is_important = false){
  this.value = value;
  this.label = label;
  if(label == null){
    this.label = value;
  }
  this.is_important = is_important;
}

function NumberAxisGenerator(value_1, value_2, min_number_fo_axes = 2, max_number_of_axes=7){
  this.axes = [];
  this.value_1 = value_1;
  this.value_2 = value_2;
  this.min_number_fo_axes = min_number_fo_axes;
  this.max_number_of_axes = max_number_of_axes;

  this.generate_axes = function(){
    this.axes = [];
    var interval = this.value_2-this.value_1;
    if (interval <= 0){
      return this.axes;
    }
    divisor = 1;
    number_of_axes = Math.trunc(interval / divisor);
    var modes = [2.5,2,2];
    i = 0
    while (number_of_axes > this.max_number_of_axes){
      divisor*=modes[i];
      number_of_axes = Math.trunc(interval / divisor);
      i++;
      if (i == 3){
        i = 0;
      }
    }
    if (divisor == 1){
      i=1;
      while (number_of_axes < this.min_number_fo_axes){
        divisor/=2;
        number_of_axes = Math.trunc(interval / divisor)
        i++;
        if (i == 3){
          i = 1;
        }
      }
    }
    var axis;
    var starting_value = this.value_1;
    while((starting_value % divisor) != 0){
      starting_value++;
    }
    for (var i=0;i<number_of_axes;i++){
      axis = new Axis(starting_value+i*divisor);
      this.axes.push(axis);
    }
    // Value interval between two axes

    this.interval = divisor;
    return this.axes;
  }
}

function TimeAxisGenerator(value_1, value_2, min_number_fo_axes = 2, max_number_of_axes=7){
  this.axes = [];
  this.value_1 = value_1;
  this.value_2 = value_2;
  this.min_number_fo_axes = min_number_fo_axes;
  this.max_number_of_axes = max_number_of_axes;

  this.generate_axes = function(){
    this.axes = [];
    var interval = this.value_2-this.value_1;
    if (interval < 1){
      return this.axes;
    }
    // seconds

    var mode = 0;
    var modes = [
      1, // s
      60, // min
      3600, // hours
      86400, //days
      2628000, // months
      31536000, // years
    ]
    var mode_names = [
      's', // s
      'min', // min
      'h', // hours
      'd', //days
      'm', // months
      'y', // years
    ]

    var divisor = modes[mode];
    var number_of_axes = Math.trunc(interval / divisor);

    while(number_of_axes > max_number_of_axes && mode < modes.length){
      mode++;
      divisor = modes[mode];
      number_of_axes = Math.trunc(interval / divisor);
    }
    var starting_value = this.value_1;
    while((starting_value % divisor) != 0){
      starting_value++;
    }
    var axis;
    if(starting_value-this.value_1 < divisor){
      number_of_axes++;
    }
    for (var i=0;i<number_of_axes;i++){
      axis = new Axis(starting_value+i*divisor);
      axis.label = (starting_value+i*divisor)/divisor+mode_names[mode];
      if(mode < modes.length){
        if((axis.value % modes[mode+1]) == 0){
          console.log(axis.value + '%' + modes[mode+1] + '= 0');
          axis.is_important = true;
        }
      }
      this.axes.push(axis);
    }
    return this.axes;
  }
}
