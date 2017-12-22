AFRAME.registerComponent("projectile", {
  schema: {
    speed: { default: -0.4 },
    target: { default: "" }
  },

  init: function () {
    let enemies = document.querySelectorAll(".asteroid");
    this.targets = [];
    //this.ticks = 0;
    for (let i = 0; i < enemies.length; i++) {
      this.targets.push(enemies[i]);
    }
  },

  tick: function () {
    let intersect = (sphere, box) => {
      // get box closest point to sphere center by clamping
      let x = Math.max(box.minX, Math.min(sphere.x, box.maxX)),
        y = Math.max(box.minY, Math.min(sphere.y, box.maxY)),
        z = Math.max(box.minZ, Math.min(sphere.z, box.maxZ))

      // this is the same as isPointInsideSphere
      let distance = Math.sqrt(
        (x - sphere.x) * (x - sphere.x) +
        (y - sphere.y) * (y - sphere.y) +
        (z - sphere.z) * (z - sphere.z)
      );
      return distance < 0.25;
    };

    let bullet = this.el;

    if (bullet.object3D.position.length() > 100 && bullet.parentEl)
      bullet.parentNode.removeChild(bullet);
    else if (this.targets.length !== 0 && bullet.parentEl) {
      for (let i = 0; i < this.targets.length; i++) {
        let currentEnemy = this.targets[i].object3D;
        let box = {
          minX: currentEnemy.position.x - 2,
          minY: currentEnemy.position.y - 2,
          minZ: currentEnemy.position.z - 2,
          maxX: currentEnemy.position.x + 2,
          maxY: currentEnemy.position.y + 2,
          maxZ: currentEnemy.position.z + 2
        };
        let sphere = bullet.object3D.translateY(this.data.speed).position,
          target = this.targets[i];

        if (intersect(sphere, box) && target.parentNode) {
          target.parentNode.removeChild(target);
          bullet.parentNode.removeChild(bullet);
          this.targets.splice(i, 1);
          return;
        }
      }
    }
    bullet.object3D.translateY(this.data.speed);
  }
});