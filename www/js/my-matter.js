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

let circ = (x, y, r, color) => {
  return Bodies.circle(x, y, r,
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

let object_infos = [];

let add_object = (obj) => {
  World.add(engine.world, [obj]);

  object_infos.push(
    new ObjectInfo(obj, Vector.create(0, 0), Vector.create(0, 0), Vector.clone(obj.position))
  );
}

let delete_object = (obj) => {
  for (var i in object_infos) {
    if (obj === object_infos[i].obj) {
      object_infos.splice(i, 1);
      break;
    }
  }
  console.log(objects);
  reset();
}

let set_velocity = (obj, velocity) => {
  for (var i in object_infos) {
    if (object_infos[i].is_info_of(obj)) {
      velocities[i] = Vector.create(0,0);
      default_velocities[i] = velocity;
      object_infos[i].default_velocity = velocity;
      return;
    }
  }
  throw Exception;
}

let set_position = (obj, position) => {
  for (var i in object_infos) {
    if (object_infos[i].is_info_of(obj)) {
      object_infos[i].position = position;
      object_infos[i].reset();
      return;
    }
  }
  throw Exception;
}

let remember_positions = () => {
  for (var i in object_infos) {
    object_infos[i].restore_position();
  }
}