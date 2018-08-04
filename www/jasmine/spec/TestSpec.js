describe("物理エンジンの環境", function() {
    let value;
    beforeAll(function() {
      console.log("[beforeAll]");
      main_load(document.getElementById("matter-canvas"));
    });

    beforeEach(function() {
      console.log("[beforeEach]");
      console.log("value");
      value = 1
    });

    it("エンジンの初期化", function() {
      expect(HEIGHT).toBe(510);
      expect(WIDTH).toBe(510);
      console.log(engine);
    });

    it("テストのテスト", function() {
      console.log(value);
      expect(value).toBe(1);
    });
  });
