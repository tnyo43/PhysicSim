function test_make_element () {
  let value;
  beforeAll(function() {
    console.log("[beforeAll]");
    //start_app(document.getElementById("matter-canvas"));
  });

  beforeEach(function() {
    console.log("[beforeEach]");
    
    for (var i = 0; i < 4; i++) fence_used[i] = true;
    reset ();
  });

  afterEach(function() {
    clear();
  });

  describe("オブジェクトを追加", function() {
    it("追加ボタンを押すとオブジェクトが1つ増える", function() {
      //console.log(engine.world.bodies);
    });
  });
}