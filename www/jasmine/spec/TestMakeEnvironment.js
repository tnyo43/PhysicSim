function test_make_element () {
  let value;
  beforeAll(function() {
    console.log("[beforeAll]");
  });

  beforeEach(function() {
    console.log("[beforeEach]");
    clear();
    
    for (var i = 0; i < 4; i++) fence_used[i] = true;
    reset ();
  });

  describe("オブジェクトを追加", function() {
    beforeEach(function() {
      console.log("[beforeEach]");
      clear();
      
      for (var i = 0; i < 4; i++) fence_used[i] = true;
      reset ();
    });

    it("スタートを押すとオブジェクトが追加できない", function() {
      add_element_to_world(rect(10, 20, 30, 40));
      expect(object_infos.length).toBe(1);
      start();
      add_element_to_world(rect(10, 20, 30, 40));
      expect(object_infos.length).toBe(1);
      stop();
      add_element_to_world(rect(10, 20, 30, 40));
      expect(object_infos.length).toBe(1);
      reset();
      add_element_to_world(rect(10, 20, 30, 40));
      expect(object_infos.length).toBe(2);
    });


    it("追加ボタンを押すとオブジェクトが1つ増える", function() {
      for (var i = 0; i < OBJECT_MAX; i++) {
        add_element_to_world(rect(10, 20, 30, 40));
        expect(object_infos.length).toBe(i+1);
      }
      add_element_to_world(rect(10, 20, 30, 40));
      expect(object_infos.length).toBe(OBJECT_MAX);
    });
  });
}