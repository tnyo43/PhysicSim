const canvas = document.getElementById("matter-canvas");
const HEIGHT = 500; //screen.height;
const WIDTH = 500; //screen.width;

var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Runner = Matter.Runner;

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


let start = () => {
  World.clear(engine.world);
  if (runner != null) {
    Runner.stop(runner);
  }
  Engine.clear(engine);
  
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
  World.add(engine.world, [boxA, boxB, boxC, ground]);

  // Matter.js エンジン起動
  runner = Engine.run(engine);
};

reset_btn = document.getElementById("reset-btn");
reset_btn.onclick = start;
start ();