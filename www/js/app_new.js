let engine;
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
  Engine.run(engine);
  update_fence();
}

/// スタートボタンを押す前の状態に戻す
let reset = () => {
  stop();
  /// 物理演算は停止させて置く
  engine.world.gravity.y = 0;

  World.clear(engine.world);
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
  update_fence();

  objects = [];
  velocities = [];
  default_velocities = [];
  default_positions = [];
}

/// HTMLエレメント
let use_gravity;
let start_btn;
let reset_btn;

let side_menu_btn;


let is_running;
let is_first_run = true;

let start = () => {
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

let stop = (message) => {
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

  start_btn = document.getElementById("start-btn");
  start_btn.onclick = () => {
    if (!is_running) start();
    else stop();
  }

  reset_btn = document.getElementById("reset-btn");
  reset_btn.onclick = reset;
  
  side_menu_btn = document.getElementById("side-menu-btn");
  side_menu_btn.onclick = () => {
    var menu = document.getElementById('menu');
    menu.open();
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

