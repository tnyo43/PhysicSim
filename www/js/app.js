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

start_btn = document.getElementById("start-btn");
start_btn.onclick = start;
reset_btn = document.getElementById("reset-btn");
reset_btn.onclick = restart;
use_gravity = document.getElementById("gravity-check");
use_gravity.checked = true;
restart ();