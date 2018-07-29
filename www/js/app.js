const canvas = document.getElementById("matter-canvas");
const HEIGHT = 500; //screen.height;
const WIDTH = 500; //screen.width;

var Engine = Matter.Engine;
var World = Matter.World;
var Body = Matter.Body;
var Bodies = Matter.Bodies;
var Runner = Matter.Runner;
var Vector = Matter.Vector;

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
let runner = null;
engine.render.options.wireframeBackground = "#004444";

let objects = [];
let velocities = [];
let angular_velocities = [];

let init = () => {
  World.clear(engine.world);
  if (runner != null) {
    Runner.stop(runner);
  }
  Engine.clear(engine);
  
  objects = [];
  velocities = [];
  angular_velocities = [];
}

let add_object = (obj) => {
  console.log(obj);
  objects.push(obj);
  velocities.push(Vector.create(0, 0));
  angular_velocities.push(0);
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
      render: {
        lineWidth: 5,
        fillStyle: '#ff0000',
        strokeStyle: 'rgba(0, 0, 0, 0)',
      }
    });
  var boxB = Bodies.rectangle(45, 50, 80, 80, 
    {
      render: {
        lineWidth: 5,
        fillStyle: '#00ff00',
        strokeStyle: 'rgba(0, 0, 0, 0)',
      }
    });
    var boxC = Bodies.rectangle(180, 40, 80, 80, 
    {
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
  running = false;
  start();
  console.log("reset");
};

let running = false;
let start = () => {
  running = !running;
  if (running) {
    console.log(objects)
    for (var i in objects) {
      Body.setVelocity(objects[i], velocities[i]);
      Body.setAngularVelocity(objects[i], angular_velocities[i]);
    }
    engine.world.gravity.y = 1;
  } else {
    for (var i in objects) {
      var obj = objects[i];
      velocities[i] = Vector.clone(obj.velocity);
      angular_velocities[i] = obj.angularVelocity;
      Body.setVelocity(obj, Vector.create(0, 0));
      Body.setAngularVelocity(obj, 0);
    };
    engine.world.gravity.y = 0;
  }
}

start_btn = document.getElementById("start-btn");
start_btn.onclick = start;
reset_btn = document.getElementById("reset-btn");
reset_btn.onclick = restart;


restart ();