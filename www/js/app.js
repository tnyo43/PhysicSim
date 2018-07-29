const canvas = document.getElementById("matter-canvas");
const HEIGHT = 500; //screen.height;
const WIDTH = 500; //screen.width;
const GRAVITY = 1;
const INF = 10000000;
let g = GRAVITY;

var Engine = Matter.Engine;
var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;
var Runner = Matter.Runner;
var Vector = Matter.Vector;
var MouseConstraint = Matter.MouseConstraint;
var Events = Matter.Events;

var engine = Engine.create(canvas,
  {
    render : {
      options : {      
        wireframes: false,
        width: WIDTH,
        height: HEIGHT
      }
    }
  });
var mouseConstraint = MouseConstraint.create(engine, {
  constraint: {
      stiffness: 1,
      render: {
          visible: false,
          lineWidth: 0
      }
  }
});

var dragged_object = null;
Events.on(mouseConstraint, "mousedown", (e) => {
  if (e.source.body != null) {
    dragged_object = e.source.body;
    Body.setMass(dragged_object, 1);
  }
});
Events.on(mouseConstraint, "mouseup", (e) => {
  if (dragged_object != null) {
    Body.setVelocity(dragged_object, Vector.create(0, 0));
    Body.setAngularVelocity(dragged_object, 0);
    Body.setMass(dragged_object, INF);
    dragged_object = null;
  }
})
Events.on(engine, "collisionStart", (e) => {
  if (dragged_object != null) {
    var objs = [e.pairs[0].bodyA, e.pairs[0].bodyB];
    for (var obj of objs) {
      Body.setVelocity(obj, Vector.create(0, 0));
      Body.setAngularVelocity(obj, 0);
    }
  }
});
let runner = null;

let objects = [];
let velocities = [];
let angular_velocities = [];
let masses = [];

let init = () => {
  World.clear(engine.world);
  if (runner != null) {
    Runner.stop(runner);
  }
  Engine.clear(engine);
  
  engine.render.options.wireframeBackground = "#004444";
  
  objects = [];
  velocities = [];
  angular_velocities = [];
  masses = [];
}

let add_object = (obj) => {
  objects.push(obj);
  velocities.push(Vector.create(0, 0));
  angular_velocities.push(0);
  masses.push(1);
  World.add(engine.world, [obj]);

  console.log(obj)
  var op = document.createElement("option");
  op.text = obj.id;
  target_obj1_select.add(op);
  op = document.createElement("option");
  op.text = obj.id;
  target_obj2_select.add(op);
  op = document.createElement("option");
  op.text = obj.id;
  set_object_select.add(op);
}
let add_objects = (objs) => {
  for (var obj of objs) add_object(obj);
}

let restart = () => {
  init ();

  // 二つの箱(四角)と地面を作る
  var boxA = Bodies.rectangle(100, 200, 80, 80, 
    {
      inertia: Infinity,
      render: {
        lineWidth: 5,
        fillStyle: '#ff0000',
        strokeStyle: 'rgba(0, 0, 0, 0)',
      }
    });
  var boxB = Bodies.rectangle(45, 50, 80, 80, 
    {
      inertia: Infinity,
      render: {
        lineWidth: 5,
        fillStyle: '#00ff00',
        strokeStyle: 'rgba(0, 0, 0, 0)',

      }
    });
    var boxC = Bodies.rectangle(170, 40, 80, 80, 
    {
      inertia: Infinity,
      render: {
        lineWidth: 5,
        fillStyle: '#0000ff',
        strokeStyle: 'rgba(0, 0, 0, 0)',
      }
    });

  // isStatic:静的(完全固定)
  var ground = Bodies.rectangle(WIDTH/2, HEIGHT, WIDTH, 10,
  {
      isStatic: true,
      render : {
        fillStyle: '#000000',
        strokeStyle: 'rgba(0, 0, 0, 0)',
        lineWidth: 0
      }
    });

  // 二つの箱(四角)と地面を追加

  World.add(engine.world, [ground]);
  add_objects([boxA, boxB, boxC]);

  // Matter.js エンジン起動
  runner = Engine.run(engine);
  running = true;
  g = use_gravity.checked ? GRAVITY : 0;
  start();
};

let running = false;
let start = () => {
  running = !running;
  if (running) {
    for (var i in objects) {
      var obj = objects[i];
      Body.setVelocity(obj, velocities[i]);
      Body.setAngularVelocity(obj, angular_velocities[i]);
      Body.setMass(obj, masses[i]);
    }
    engine.world.gravity.y = g;
    World.remove(engine.world, mouseConstraint);
  } else {
    for (var i in objects) {
      var obj = objects[i];
      velocities[i] = Vector.clone(obj.velocity);
      angular_velocities[i] = obj.angularVelocity;
      Body.setVelocity(obj, Vector.create(0, 0));
      Body.setAngularVelocity(obj, 0);
      Body.setMass(obj, INF);
    };
    engine.world.gravity.y = 0;
    World.add(engine.world, mouseConstraint);
  }
}

let is_setting_open = true;
let show_setting = () => {
  is_setting_open = !is_setting_open;
  if (!is_setting_open) {
    setting_frame.style.display = "none";
  } else {
    set_object_input(0);
  }
}

let set_object_input = (index) => {
  var obj = objects[index];
  posX_input.value = obj.position.x;
  posY_input.value = obj.position.y;
  console.log(veloX_input);
  console.log(obj.velocity.x);
  veloX_input.value = obj.velocity.x;
  veloY_input.value = obj.velocity.y;
  mass_input.value = masses[index];
  setting_frame.style.display = "block";  
}
let update_object_params = (index) => {
  var obj = objects[index];
  Body.setPosition(obj, Vector.create(posX_input.value, posY_input.value));
  velocities[index] = Vector.create(veloX_input.value, veloY_input.value);
  masses[index] = mass_input.value;
}

let start_btn = document.getElementById("start-btn");
start_btn.onclick = start;
let reset_btn = document.getElementById("reset-btn");
reset_btn.onclick = restart;
let use_gravity = document.getElementById("gravity-check");
use_gravity.checked = true;
let setting_btn = document.getElementById("setting-btn");
let setting_close_btn = document.getElementById("setting-close-btn");
setting_btn.onclick = show_setting;
setting_close_btn.onclick = show_setting;
let setting_frame = document.getElementById("setting-frame");
show_setting();
let target_obj1_select = document.getElementById("obj1-select");
let target_obj2_select = document.getElementById("obj2-select");
let target_event_select = document.getElementById("event-select");
let target_select = document.getElementById("target-select");
let set_object_select = document.getElementById("obj-select");
set_object_select.onchange = () => {
  var id_ = set_object_select.value;
  for (var i in objects) {
    if (objects[i].id == id_) {
      set_object_input(i);
      break;
    }
  }
}

let posX_input = document.getElementById("posX");
let posY_input = document.getElementById("posY");
let sizeH_input = document.getElementById("sizeH");
let sizeW_input = document.getElementById("sizeW");
let veloX_input = document.getElementById("veloX");
let veloY_input = document.getElementById("veloY");
let mass_input = document.getElementById("obj-mass");
let param_btn = document.getElementById("param-btn");
param_btn.onclick = () => {
  var id_ = set_object_select.value;
  for (var i in objects) {
    if (objects[i].id == id_) {
      update_object_params(i);
      break;
    }
  }
}

/*
posX_input
posY_input
sizeH_input
sizeW_input
veloX_input
veloY_input
mass_input
*/

// start simulation
restart ();