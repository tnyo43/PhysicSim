describe("物理エンジンの環境", function() {
    let value;
    beforeAll(function() {
      console.log("[beforeAll]");
      start_app(document.getElementById("matter-canvas"));
    });

    beforeEach(function() {
      console.log("[beforeEach]");
      
      for (var i = 0; i < 4; i++) fence_used[i] = true;
      reset ();
    });

    afterEach(function() {
      clear();
    });

    afterAll(function() {
      for (var i = 0; i < 4; i++) fence_used[i] = true;
      reset ();
      add_object(rect(10, 10, 10, 10, '#ff0000'));
    });

    it("オブジェクトを追加", function() {
      add_object(static_black(10, 10, 10, 10));
      expect(engine.world.bodies.length).toBe(5);
    });

    it("初期化すると周りの壁だけがある", function() {
      expect(engine.world.bodies.length).toBe(4);
      for (var i = 0; i < 4; i++) fence_used[i] = false;
      update_fence();
      expect(engine.world.bodies.length).toBe(0);
    });

    describe("重力", function() {

      let obj;
      beforeEach(function() {
        use_gravity.checked = true;
        update_gravity();
        obj = rect(10, 10, 10, 10, '#ff0000');
        add_object(obj);
      });

      afterEach(function() {
        use_gravity.checked = true;
        update_gravity();
      })

      it("オブジェクトを生成して置く", function() {
        expect(engine.world.bodies.length).toBe(5);
      });

      it("チェックを入れると重力の有無が変化", function() {
        use_gravity.checked = true;
        update_gravity();
        start();
        expect(engine.world.gravity.y).not.toBe(0);
        stop();

        use_gravity.checked = false;
        update_gravity();
        start();
        expect(engine.world.gravity.y).toBe(0);
        stop();
      });

      it("実行中は重力の切り替えができない", function() {
        use_gravity.checked = true;
        update_gravity();
        start();
        use_gravity.checked = false;
        update_gravity();
        expect(use_gravity.checked).toBe(true);
      });

      it("スタートを押すと物理演算スタート", function() {
        console.log(engine.world.gravity.y);
        expect(engine.world.gravity.y).toBe(0);
        start();
        console.log(engine.world.gravity.y);
        expect(engine.world.gravity.y).not.toBe(0);
        stop();
        console.log(engine.world.gravity.y);
        expect(engine.world.gravity.y).toBe(0);
      });
    });
  });
