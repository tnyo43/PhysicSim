const HEIGHT = 400;//creen.height-130;
const WIDTH = 500;//screen.width-30;

const GRAVITY = 1;
const INF = 10000000;
let g = GRAVITY;

var Engine = Matter.Engine;
var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;
var Runner = Matter.Runner;
var Vector = Matter.Vector;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;
var Events = Matter.Events;

let init_engine = (canvas, w, h) => {
  return Engine.create(canvas,
    {
      render : {
        options : {      
          wireframes: false,
          width: w,
          height: h
        }
      }
    });
}

// 壁などの黒くて動かないオブジェクト
// 左上のx, yと幅と高さ
let static_black = (x, y, width, height) => {
  return Bodies.rectangle(x+width/2, y+height/2, width, height,
  {
    isStatic: true,
    render : {
      fillStyle: '#000000',
      strokeStyle: 'rgba(0, 0, 0, 0)',
      lineWidth: 0
    }
  })
}

//動くオブジェクト
let rect = (x, y, width, height, color) => {
  return Bodies.rectangle(x+width/2, y+height/2, width, height,
  {
    isStatic: false,
    inertia: Infinity,
    render : {
      fillStyle: color,
      strokeStyle: '#000000',
      lineWidth: 0,  
    }
  });
}

let is_gravity_active = () => {
  return engine.world.gravity.y;
}

let objects = [];
let velocities = [];
let default_velocities = [];
let default_positions = [];

let add_object = (obj) => {
  World.add(engine.world, [obj]);

  objects.push(obj);
  velocities.push(Vector.create(0,0));
  default_velocities.push(Vector.create(0,0));
  default_positions.push(Vector.clone(obj.position));
}

let delete_object = (obj) => {
  for (var i in objects) {
    if (obj === objects[i]) {
      objects.splice(i, 1);
      velocities.splice(i, 1);
      default_velocities.splice(i, 1);
      default_positions.splice(i, 1);
      break;
    }
  }
  console.log(objects);
  reset();
}

let set_velocity = (obj, velocity) => {
  for (var i in objects) {
    if (obj === objects[i]) {
      velocities[i] = Vector.create(0,0);
      default_velocities[i] = velocity;
      return;
    }
  }
  throw Exception;
}

let set_position = (obj, position) => {
  for (var i in objects) {
    if (obj === objects[i]) {
      Body.setPosition(obj, position);
      default_positions[i] = position;
      return;
    }
  }
  throw Exception;
}

let remember_positions = () => {
  for (var i in objects) {
    default_positions[i] = Vector.clone(objects[i].position);
  }
}