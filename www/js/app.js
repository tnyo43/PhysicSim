let engine = null;

main_load = (c) => {
  const canvas = c;
  
  engine = init_engine(canvas, WIDTH, HEIGHT);

  var mouseConstraint = MouseConstraint.create(engine, {
    constraint: {
        stiffness: 1,
        render: {
            visible: false,
            lineWidth: 0
        }
    }
  });

  let FENCES = [
    static_black(0, HEIGHT-5, WIDTH, 5), // 下
    static_black(0, 0, 5, HEIGHT), // 左
    static_black(WIDTH-5, 0, 5, HEIGHT), // 右
    static_black(0, 0, WIDTH, 5), // 下
  ];
  let fence_used = [false, false, false, false]; 

  // チェックボックスの更新で枠の変更
  let update_fence = () => {
    for (var i in FENCES) {
      if (fence_checkers[i].checked ^ fence_used[i]) {
        fence_used[i] = fence_checkers[i].checked;
        if (fence_used[i]) {
          World.add(engine.world, [FENCES[i]]);
        } else {
          World.remove(engine.world, [FENCES[i]]);
        }
      }
    }
  }

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
    
    var objs = [e.pairs[0].bodyA, e.pairs[0].bodyB];
    if (dragged_object != null) {
      for (var obj of objs) {
        Body.setVelocity(obj, Vector.create(0, 0));
        Body.setAngularVelocity(obj, 0);
      }
    }
    if (target_event_select.value == "1") { //衝突
      if (objs[0].id == target1 && objs[1].id == target2 || objs[1].id == target1 && objs[0].id == target2) {
        console.log("collision!");
        past_time += Date.now() - start_time;
        console.log(past_time);
      }
    }
  });
  let runner = null;

  let objects = [];
  let velocities = [];
  let angular_velocities = [];
  let masses = [];
  let index_offset = 0;

  let init = () => {
    World.clear(engine.world);
    if (runner != null) {
      Runner.stop(runner);
    }
    Engine.clear(engine);
    
    engine.render.options.wireframeBackground = "#004444";
    
    for (var i = objects.length - 1; i >= 0; i--) {
      console.log(target_obj1_select.options[i]);
      target_obj1_select.removeChild(target_obj1_select.options[i]);
      target_obj2_select.removeChild(target_obj2_select.options[4+i]);
      set_object_select.removeChild(set_object_select.options[i]);
    }

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



    // World.add(engine.world, GROUNDS);
    fence_used = [false, false, false, false];
    update_fence();
    add_objects([boxA, boxB, boxC]);

    // Matter.js エンジン起動
    runner = Engine.run(engine);
    running = true;
    g = use_gravity.checked ? GRAVITY : 0;

    // 時間の初期化
    start_time = null;
    past_time = 0;
    start();
  };

  let running = false;
  let start_time = null;
  let past_time = 0;

  let start = () => {

    running = !running;
    if (running) {
      start_time = Date.now();

      for (var i in objects) {
        var obj = objects[i];
        Body.setVelocity(obj, velocities[i]);
        Body.setAngularVelocity(obj, angular_velocities[i]);
        Body.setMass(obj, masses[i]);
      }
      engine.world.gravity.y = g;
      World.remove(engine.world, mouseConstraint);    

      target1 = target_obj1_select.value;
      target2 = target_obj2_select.value;
    } else {
      if (start_time != null) {
        let x = Date.now () - start_time;
        past_time += x;
      }
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

  // 環境設定ボタンを押した時
  let setting_btn = document.getElementById("setting-btn");
  let setting_close_btn = document.getElementById("setting-close-btn");
  setting_btn.onclick = show_setting;
  setting_close_btn.onclick = show_setting;
  let setting_frame = document.getElementById("setting-frame");
  show_setting();


  // シミュレーション内容
  let target_obj1_select = document.getElementById("obj1-select");
  let target1 = target_obj1_select.value;
  target_obj1_select.onchange = () => {
    target1 = target_obj1_select.value;
    console.log("changed", target1);
  }
  let target_obj2_select = document.getElementById("obj2-select");
  let target2 = 1;
  target_obj2_select.onchange = () => {
    target2 = target_obj2_select.value;
    console.log("changed", target2);
  }
  let target_event_select = document.getElementById("event-select");
  let target_select = document.getElementById("target-select");

  // 枠の設定
  let fence_checkers = [
    document.getElementById("floor-check"),
    document.getElementById("left-check"),
    document.getElementById("right-check"),
    document.getElementById("ceil-check")
  ];
  for (var f of fence_checkers) {
    f.onchange = update_fence;
    f.checked = true;
  }

  // パラメータ変更
  let param_mode_btn = document.getElementById("param-mode-btn");
  let mode_new = false;
  param_mode_btn.onclick = () => {
    mode_new = !mode_new;
    if (mode_new) {
      param_mode_btn.innerText = "オブジェクトを編集";
      param_btn.innerText = "変更";
      param_btn.value = "edit";
      new_obj_mode_div.style.display = "none";
      edit_obj_mode_div.style.display = "block";
      sizeH_input.disabled = true;
      sizeH_input.value = "";
      sizeW_input.disabled = true;
      sizeW_input.value = "";
    } else {
      param_mode_btn.innerText = "オブジェクトを作成";
      param_btn.innerText = "作成";
      param_btn.value = "create";    
      new_obj_mode_div.style.display = "block";
      edit_obj_mode_div.style.display = "none";
      sizeH_input.disabled = false;
      sizeW_input.disabled = false;
    }
  }
  let new_obj_mode_div = document.getElementById("new-obj-mode-div");
  let edit_obj_mode_div = document.getElementById("edit-obj-mode-div");
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

  // パラメータインプット
  let new_obj_shape = document.getElementById("new-obj-shape");
  new_obj_shape.onchange = () => {
    console.log("value");
    if (new_obj_shape.value == "rect") {
      sizeH_input.style.display = "block";
      sizeW_input.style.display = "block";
      radius_input.style.display = "none";
    } else {
      sizeH_input.style.display = "none";
      sizeW_input.style.display = "none";
      radius_input.style.display = "block";
    }
  }
  let posX_input = document.getElementById("posX");
  let posY_input = document.getElementById("posY");
  let sizeH_input = document.getElementById("sizeH");
  let sizeW_input = document.getElementById("sizeW");
  let radius_input = document.getElementById("radius");
  let veloX_input = document.getElementById("veloX");
  let veloY_input = document.getElementById("veloY");
  let mass_input = document.getElementById("obj-mass");
  let param_btn = document.getElementById("param-btn");
  param_btn.onclick = () => {
    if (param_btn.value == "edit") {
      var id_ = set_object_select.value;
      for (var i in objects) {
        if (objects[i].id == id_) {
          update_object_params(i);
          break;
        }
      }
    } else if (param_btn.value == "create") {
      var x = (posX_input.value)|0, y = (posY_input.value)|0, m = mass_input.value;

      if (new_obj_shape.value == "rect") {
        add_object(Bodies.rectangle(
          x, y,
          sizeW_input.value,
          sizeH_input.value,
          {
            mass: m,
            inertia: Infinity,
            render: {
              lineWidth: 5,
              fillStyle: '#ff0000',
              strokeStyle: 'rgba(0, 0, 0, 0)',
            }
          }
        ));
      } else if (new_obj_shape.value == "circ") {
        add_object(Bodies.circle(
          x, y,
          radius_input.value,
          {
            mass: m,
            inertia: Infinity,
            render: {
              lineWidth: 5,
              fillStyle: '#ff0000',
              strokeStyle: 'rgba(0, 0, 0, 0)',
            }
          }
        ));
      }
    }
  }
  param_mode_btn.click();

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
}