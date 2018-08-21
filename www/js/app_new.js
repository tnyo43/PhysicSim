let engine;
let mouseConstraint;
let fence_used = [false, false, false, false];
let FENCES = [
    static_black(0, HEIGHT-5, WIDTH, 5), // 下
    static_black(0, 0, 5, HEIGHT), // 左
    static_black(WIDTH-5, 0, 5, HEIGHT), // 右
    static_black(0, 0, WIDTH, 5), // 下
];

let close_fukidashi = () => {
  document.getElementById("object-select-fukidashi").style.display = "none";
  document.getElementById("fab-div").style.display = "flex";
}

let show_fukidashi = () => {
  var idx = 0;
  for (idx = 0; idx < object_infos.length; idx++) {
    if (object_infos[idx].is_info_of(selected_object)){
      remember_positions();
      document.getElementById("object-select-fukidashi").style.display = "flex";
      document.getElementById("fab-div").style.display = "none";


      console.log(object_infos[idx].shape)
      if (object_infos[idx].shape=="rect") {
        document.getElementById("radio-shape-rect").checked=true;
        update_preview();
      } else {
        document.getElementById("radio-shape-circ").checked=true;
        update_preview();
      }

      set_resize_color();
      let l = object_infos[idx].get_last_velo_input();
      console.log(l);
      document.getElementById("velo-input1").value = l[1][0];
      document.getElementById("velo-input2").value = l[1][1];
      if (l[0] == 1) { 
        document.getElementById("velo-mode1").checked = true;
      } else {
        document.getElementById("velo-mode2").checked = true;
      }
      break;
    }
  }
}

const OBJECT_MAX = 20;

/// 物理エンジンを初期化
/// オブジェクトも消去

/// ダブルクリックの判定用
let last_mousedown = null;
let selected_object = null;
let init = (canvas) => {
  engine = init_engine(canvas, WIDTH, HEIGHT);
  update_fence();
  
  mouseConstraint = MouseConstraint.create
  (engine, {
    constraint: {
      stiffness: 1,
      render: {
        visible: false,
        lineWidth: 0
      }
    }
  });

  Events.on(mouseConstraint, "mousedown", (e) => {
    if (!is_running && new Date().getTime() - last_mousedown < 200) {
      selected_object = e.source.body;
      if (selected_object) {
        show_fukidashi();
      }
    }
    last_mousedown = new Date().getTime();
  });
  Events.on(mouseConstraint, "startdrag", (e) => {

  });
  Events.on(mouseConstraint, "enddrag", (e) => {
    if (e.body) {
      Body.setVelocity(e.body, Vector.create(0, 0));
    }
  });

  World.add(engine.world, mouseConstraint);
  Engine.run(engine);

  simulate_time = 0;

  let show_timer = () => {
    let t = simulate_time;
    if (is_running) t += new Date().getTime() - start_at;
    document.getElementById("timer").innerHTML = (t/1000).toFixed(3);
    window.requestAnimationFrame(show_timer);
  }
  window.requestAnimationFrame(show_timer);
}

let simulate_time = 0;
let start_at = null;

/// スタートボタンを押す前の状態に戻す
let reset = () => {
  stop();

  World.clear(engine.world);
  World.add(engine.world, mouseConstraint);
  update_fence();

  for (var i in object_infos) {
    World.add(engine.world, [object_infos[i].obj]);
    object_infos[i].reset();
  }
  is_first_run = true;
  simulate_time = 0;
  start_at = null;
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

  object_infos = [];
  
  simulate_time = 0;
  start_at = null;
}

/// HTMLエレメント
let use_gravity;
let start_btn;
let start_fab
let reset_btn;
let reset_fab;
let add_fab;
let delete_dialog;

/// サイズ変更用
let resize_height_slider;
let resize_width_slider;


let is_running;
let is_first_run = true;

let start = () => {
  close_fukidashi();

  try{
    World.remove(engine.world, mouseConstraint);
  } catch (Exception) {

  }
  engine.world.gravity.y = g;
  is_running = true;

  if (is_first_run) remember_positions();

  for (var i in object_infos)
    object_infos[i].set_start(is_first_run);  
  is_first_run = false;

  start_at = new Date().getTime();
}

let stop = () => {
  engine.world.gravity.y = 0;
  is_running = false;

  for (var i in object_infos) {
    object_infos[i].stop();
  }

  simulate_time += new Date().getTime() - start_at;
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

  document.getElementById("setting-btn").onclick = () => {
    start();
  }

  add_fab = document.getElementById("add-fab");
  add_fab.onclick = () => {
    add_element_to_world(rect(10, 20, 30, 40));
  }

  document.getElementById("object-select-fukidashi-close").onclick = () => {
    close_fukidashi();
    selected_object = null;
  }

  delete_dialog = document.getElementById('delete-alert-dialog');
  document.getElementById("object-select-delete-btn").onclick = () => {
    if (delete_dialog) {
      delete_dialog.show();
    } else {
      ons.createElement('delete-alert-dialog.html', { append: true })
        .then(function(dialog) {
          delete_dialog = dialog;
          dialog.show();
        })
    }
  }
}

let delete_select = (s) => {
  document.getElementById('delete-alert-dialog').hide();
  if (s == "yes") {
    delete_object(selected_object);
    close_fukidashi();
    selected_object = null;
  }
}

let add_element_to_world = (obj) => {
    if (is_first_run) {
      if (object_infos.length < OBJECT_MAX) add_object(obj);
      else{
        /// 警告文を見せる
      }
    }
    else {
      /// 警告文を見せる
    }
}

let change_shape = (shape, mode) => {
  console.log(selected_object);

  let remove_one = () => {
    var l = object_infos.length;
    delete_object(selected_object);
    return l-object_infos.length==1;
  }
  console.log(remove_one);
  console.log(shape, selected_object.label, shape == "circ" && selected_object.label == "Rectangle Body");
  if (shape == "circ" && selected_object.label == "Rectangle Body") {
    if (remove_one()) {
      var p = selected_object.position;
      var v = selected_object.vertices;
      r = Math.min(Math.sqrt(Math.pow(v[0].x-v[1].x,2)+Math.pow(v[0].y-v[1].y, 2)),Math.sqrt(Math.pow(v[1].x-v[2].x,2)+Math.pow(v[1].y-v[2].y,2)))/2;
      selected_object = circ(p.x, p.y, r, selected_object.render.fillStyle)
      add_object(selected_object, shape="circ");
    }
  } else if (shape == "rect" && selected_object.label == "Circle Body") {
    if (remove_one()) {
      var p = selected_object.position;
      var r = selected_object.circleRadius;
      selected_object = rect(p.x-r, p.y-r, 2*r, 2*r,selected_object.render.fillStyle)
      add_object(selected_object);
    }
  } else if (shape == "resize") {
    if (selected_object.label == "Rectangle Body") {
      if (remove_one()) {
        var p = selected_object.position;
        var w = document.getElementById("resize-width-slider").value;
        var h = document.getElementById("resize-hieght-slider").value;
        selected_object = rect(p.x-w/2, p.y-h/2, w, h,selected_object.render.fillStyle)
        add_object(selected_object);
      }
    } else if (selected_object.label == "Circle Body") {
      if (remove_one()) {
        var p = selected_object.position;
        var r = document.getElementById("resize-hieght-slider").value/2;
        selected_object = circ(p.x, p.y, r,selected_object.render.fillStyle)
        add_object(selected_object);
      }
    }
  }
  
  console.log("change shape done", mode, mode!="test");
  if (mode != "test") {
    update_preview();
  }
}

let update_preview = () => {
  var div = document.getElementById("preview-div");
  if (selected_object.label == "Rectangle Body") {
    console.log(div.style.borderRadius = '0%');
    document.getElementById("resize-width-slider").disabled = false;
  } else if (selected_object.label == "Circle Body") {
    console.log(div.style.borderRadius = '50%');
    document.getElementById("resize-width-slider").disabled = true;
    div.style.width = div.style.height;
  }
}

let resize_value_change = (c, v) => {
  if (c == "h") {
    document.getElementById("preview-div").style.height = v + "px";
    if (selected_object.label == "Circle Body") {
      document.getElementById("preview-div").style.width = v + "px";
    }
  } else if (c == "w") {
    document.getElementById("preview-div").style.width = v + "px";
  }
}

/// ポップアップの中のオブジェクトの色を変更
let set_resize_color = () => {
  var color = selected_object.render.fillStyle;
  var div = document.getElementById("preview-div");
  div.style.backgroundColor = color;
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

let update_velocity = () => {
  for (var i in object_infos) {
    if (!object_infos[i].is_info_of(selected_object)) continue;

    if (document.getElementById("velo-mode1").checked) {
      object_infos[i].default_velocity = Vector.create(
        document.getElementById("velo-input1").value,
        -Number(document.getElementById("velo-input2").value)
      )
    } else {
      let v = Number(document.getElementById("velo-input1").value);
      let r = -Number(document.getElementById("velo-input2").value)/180*Math.PI;

      object_infos[i].default_velocity = Vector.create(
        v*Math.cos(r), v*Math.sin(r)
      )

    }
    object_infos[i].set_last_velo_input(
      (document.getElementById("velo-mode1").checked) ? 1 : 2,
      [document.getElementById("velo-input1").value, document.getElementById("velo-input2").value]
    );
  }


}

let update_velocity_input = () => {

}