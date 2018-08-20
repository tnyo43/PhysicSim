class ObjectInfo{
  constructor(obj, v, dv, dp) {
    this.obj = obj;
    this.velocity = v;
    this.default_velocity = dv;
    this.default_position = dp;

    this.is_info_of = (obj) => {
      return this.obj === obj;
    }

    this.set_start = (is_first_run) => {
      console.log(is_first_run);
      if (is_first_run) {
        this.velocity = this.default_velocity;
      }
      console.log(this.velocity);
      Body.setVelocity(this.obj, this.velocity);
    }

    this.set_default_position = () => {
      Body.setPosition(this.obj, this.default_position);
    }

    this.stop = () => {
      this.velocity = Vector.clone(this.obj.velocity)
      Body.setVelocity(this.obj, Vector.create(0,0));

    }

    this.reset = () => {
      Body.setPosition(this.obj, Vector.clone(this.default_position));
      Body.setVelocity(this.obj, Vector.create(0,0));
    }

    this.restore_position = () => {
      this.default_position = Vector.clone(this.obj.position);
    }
  }

  set default_velocity (dv) {
    this._default_velocity = dv;
    this.velocity = Vector.create(0, 0);
  }

  get default_velocity () {
    return this._default_velocity;
  }

  set obj (obj) {
    this._obj = obj;
  }

  get obj () {
    return this._obj;
  }

  set velocity (v) {
    this._velocity = v;
  }

  get velocity () {
    return this._velocity;
  }

  set position (p) {
    this.default_position = p;
  }

  get position () {
    return this.default_position;
  }
}