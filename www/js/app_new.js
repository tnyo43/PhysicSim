let engine;
let mouseConstraint;
let fence_used = [false, false, false, false];
let FENCES = [
    static_black(0, HEIGHT-5, WIDTH, 5), // 下
    static_black(0, 0, 5, HEIGHT), // 左
    static_black(WIDTH-5, 0, 5, HEIGHT), // 右
    static_black(0, 0, WIDTH, 5), // 下
];

/// 物理エンジンを初期化
/// オブジェクトも消去
let init = (canvas) => {
  engine = init_engine(canvas, WIDTH, HEIGHT);
  update_fence();
  
  var mouse = Mouse.create(canvas.elt);
  mouseConstraint = MouseConstraint.create
  (engine, {
    //mouse: mouse,
    constraint: {
      stiffness: 1,
      render: {
        visible: false,
        lineWidth: 0
      }
    }
  });

  Events.on(mouseConstraint, "mousedown", (e) => {
    console.log("mouse down");
    reset();
  });
  Events.on(mouseConstraint, "startdrag", (e) => {
    console.log(e.body);
    console.log("start drag");
  });
  Events.on(mouseConstraint, "enddrag", (e) => {
    console.log(e);
    if (e.body) {
      Body.setVelocity(e.body, Vector.create(0, 0));
    }
    start();
    console.log("end drag");
  });

  World.add(engine.world, mouseConstraint);
  Engine.run(engine);
}

/// スタートボタンを押す前の状態に戻す
let reset = () => {
  console.log("reset");
  stop();

  World.clear(engine.world);
  World.add(engine.world, mouseConstraint);
  update_fence();

  for (var i in objects) {
    World.add(engine.world, [objects[i]]);
    Body.setPosition(objects[i], Vector.clone(default_positions[i]));
    Body.setVelocity(objects[i], Vector.create(0,0));
  }
  is_first_run = true;
}

let update_fence = () => {
  for (var i in FENCES) {
    if (fence_used[i]) {
      World.add(engine.world, [FENCES[i]]);
    } else {
      World.remove(engine.world, [FENCES[i]]);
    }
  }
}

let clear = () => {
  World.clear(engine.world);
  World.add(engine.world, mouseConstraint);
  update_fence();

  objects = [];
  velocities = [];
  default_velocities = [];
  default_positions = [];
}

/// HTMLエレメント
let use_gravity;
let start_btn;
let start_fab
let reset_btn;
let reset_fab;



let is_running;
let is_first_run = true;

let start = () => {
  console.log("start");
  try{
    World.remove(engine.world, mouseConstraint);
  } catch (Exception) {

  }
  engine.world.gravity.y = g;
  is_running = true;

  for (var i in objects) {
    if (is_first_run){
      velocities[i] = Vector.clone(default_velocities[i]);
    } 
    Body.setVelocity(objects[i], velocities[i]);
  }
  is_first_run = false;
}

let stop = () => {
  console.log("stop");

  engine.world.gravity.y = 0;
  is_running = false;

  for (var i in objects) {
    velocities[i] = Vector.clone(objects[i].velocity);
    Body.setVelocity(objects[i], Vector.create(0,0));
  }
}

/// 全てを実行する前に1回だけ
let start_app = (canvas) => {
  init(canvas);
  
  use_gravity = document.getElementById("gravity-check");
  use_gravity.checked = true;
  engine.world.gravity.y = 0;
  use_gravity.onchange = update_gravity();

/*
  start_btn = document.getElementById("start-btn");
  start_btn.onclick = () => {
    if (!is_running) start();
    else stop();
  }
*/

  start_fab = document.getElementById("start-fab");
  start_fab.onclick = () => {
    console.log("start-fab");
    if (!is_running) start();
    else stop();
  }

/*
  reset_btn = document.getElementById("reset-btn");
  reset_btn.onclick = reset;
*/
  reset_fab = document.getElementById("reset-fab");
  reset_fab.onclick = reset;

  console.log(start_fab);
  console.log(start_fab.onclick);
  console.log(reset_fab);
  console.log(reset_fab.onclick);

  document.getElementById("setting-btn").onclick = () => {
    start();
  }
}

let update_gravity = () => {
  if(is_running) {
    use_gravity.checked = !use_gravity.checked;
  }
  else if (use_gravity.checked) {
    g = GRAVITY;
  } else {
    g = 0;
  }
}

let app_default_setting = () => {
  for (var i = 0; i < 4; i++) fence_used[i] = true;
  reset ();
  let obj;

  use_gravity.checked = true;
  update_gravity();
  obj = rect(100, 100, 100, 100, '#ff0000');
  add_object(obj);
}