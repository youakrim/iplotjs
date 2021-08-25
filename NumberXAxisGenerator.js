function Axis(value, label = null, is_important = False){
  this.value = value;
  this.label = label;
  if(label == null){
    this.label = value;
  }
  this.is_important = is_important;
}

function NumberXAxisGenerator(value_1, value_2, min_number_fo_axes = 2, max_number_of_axes=7){
  this.axes = [];
  interval = value_2 - value_1;
  divisor = 1;
  number_of_axes = Math.trunc(interval / divisor);
  while (number_of_axes > max_number_of_axes){
    divisor*=10;
    number_of_axes = Math.trunc(interval / divisor);
  }
  while (number_of_axes < min_number_fo_axes){
    divisor/=10;
    number_of_axes = Math.trunc(interval / divisor);
  }
  var axis;
  for (var i;i<number_of_axes;i++){
    axis = new Axis()
    axis.value = value_1+i*divisor;
  }
}
