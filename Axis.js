function Axis(value, label = null, is_important = False){
  this.value = value;
  this.label = label;
  if(label == null){
    this.label = value;
  }
  this.is_important = is_important;
}
