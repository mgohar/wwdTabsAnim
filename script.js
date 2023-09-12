var vector = new Two.Vector();
var entities = [];
var mouse;
var activeClick = true;
var bgColor = ["#101010", "#E7F1FB", "#FD5A1E", "#C9FF00", "#C46BFF"];
var textColors = ["#ffffff", "#101010", "#ffffff", "#101010", "#ffffff"];
var copyTab1 = [
  "Strict contracts and scopes",
  "Stiff workflow and processes",
  "Lack of personality & attention",
  "Lackluster delivery",
  "High overhead costs",
  "Slow decision-making",
  "Limited transparency",
  "Cookie-cutter solutions",
  "Inconsistent team members",
];
var copyTab2 = [
  "Wasting time on hiring",
  "Lack of external insights",
  "Limited scalability",
  "High overhead costs",
  "Narrow expertise",
  "Recruitment and training",
  "Resource competition",
  "Employee turnover",
  "Limited flexibility",
];
var copyTab3 = [
  "Not scalable",
  "Slow delivery",
  "Limited resources",
  "Limited skillset",
  "Limited availability",
  "Poor systems & processes",
  "Require micromanagement",
];

var two = new Two({
  type: Two.Types.canvas,
  // fullscreen: true,
  width: window.innerWidth / 2,
  height: window.innerHeight,
  autostart: true,
}).appendTo(document.querySelector(".BloxDroppingAnim"));

var solver = Matter.Engine.create();
solver.world.gravity.y = 1.5;

var bounds = {
  length: 5000,
  thickness: 50,
  properties: {
    isStatic: true,
  },
};

// bounds.top = createBoundary(bounds.length, bounds.thickness);
bounds.left = createBoundary(bounds.thickness, bounds.length);
bounds.right = createBoundary(bounds.thickness, bounds.length);
bounds.bottom = createBoundary(bounds.length, bounds.thickness);

Matter.World.add(solver.world, [
  bounds.left.entity,
  bounds.right.entity,
  bounds.bottom.entity,
]);

var defaultStyles = {
  size: 16,
  leading: 50,
  family: "Angus, Arial, sans-serif",
  alignment: "center",
  baseline: "middle",
  margin: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

var buzzTab1 = document.querySelector(".buzz-tab1");
var buzzTab2 = document.querySelector(".buzz-tab2");
var buzzTab3 = document.querySelector(".buzz-tab3");
buzzTab1.addEventListener("click", function () {
  if (activeClick) dropGenTab(copyTab1);
});
buzzTab2.addEventListener("click", function () {
  if (activeClick) dropGenTab(copyTab2);
});
buzzTab3.addEventListener("click", function () {
  if (activeClick) dropGenTab(copyTab3);
});

addSlogan(copyTab1);
resize();
mouse = addMouseInteraction();
two.bind("update", update);

function addMouseInteraction() {
  // add mouse control
  var mouse = Matter.Mouse.create(document.querySelector(".BloxDroppingAnim"));
  var mouseConstraint = Matter.MouseConstraint.create(solver, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
    },
  });

  Matter.World.add(solver.world, mouseConstraint);

  return mouseConstraint;
}

function resize() {
  console.log(2222);
  var length = bounds.length;
  var thickness = bounds.thickness;

  // vector.x = two.width / 2;
  // vector.y = - thickness / 2;
  // Matter.Body.setPosition(bounds.top.entity, vector);

  vector.x = -thickness / 2;
  vector.y = two.height / 2;
  Matter.Body.setPosition(bounds.left.entity, vector);

  vector.x = two.width + thickness / 2;
  vector.y = two.height / 2 - 200;
  Matter.Body.setPosition(bounds.right.entity, vector);

  vector.x = two.width / 2;
  vector.y = two.height + thickness / 2 - 200;
  Matter.Body.setPosition(bounds.bottom.entity, vector);

  // var size;

  // if (two.width < 480) {
  //   size = two.width * 0.12;
  // } else if (two.width > 1080 && two.width < 1600) {
  //   size = two.width * 0.07;
  // } else if (two.width > 1600) {
  //   size = two.width * 0.06;
  // } else {
  //   size = two.width * 0.08;
  // }

  // var leading = size * 0.8;

  // for (var i = 0; i < two.scene.children.length; i++) {
  //   var child = two.scene.children[i];

  //   if (!child.isWord) {
  //     continue;
  //   }

  //   var text = child.text;
  //   var rectangle = child.rectangle;
  //   var entity = child.entity;

  //   text.size = size;
  //   text.leading = leading;

  //   var rect = text.getBoundingClientRect(true);
  //   rectangle.width = rect.width;
  //   rectangle.height = rect.height;

  //   Matter.Body.scale(entity, 1 / entity.scale.x, 1 / entity.scale.y);
  //   Matter.Body.scale(entity, rect.width, rect.height);
  //   entity.scale.set(rect.width, rect.height);

  //   text.size = size / 3;
  // }
  setTimeout(() => {
    activeClick = true;
  }, 2000);
}

function addSlogan(copy) {
  var x = defaultStyles.margin.left;
  var y = -350; // Header offset

  for (var i = 0; i < copy.length; i++) {
    let rdm = (Math.random() * 4).toFixed(0);
    var word = copy[i];
    var group = new Two.Group();
    var text = new Two.Text(word, 0, 0, {
      ...defaultStyles,
      fill: textColors[rdm],
    });

    var rect = text.getBoundingClientRect();
    var ox = x + rect.width / 2;
    var oy = y + Math.random() * 300 + rect.height / 2;
    var ca = x + rect.width + 100;
    var cb = two.width;

    // New line
    if (ca >= cb) {
      x = 500;
      y +=
        defaultStyles.leading +
        defaultStyles.margin.top +
        defaultStyles.margin.bottom;

      ox = x + rect.width / 2;
      oy = y + rect.height / 2;
    }

    var rectangle = new Two.RoundedRectangle(0, 0, rect.width, rect.height, 12);
    rectangle.fill = bgColor[rdm];
    rectangle.noStroke();
    rectangle.visible = true;

    var entity = Matter.Bodies.rectangle(ox, oy, 1, 1);
    Matter.Body.scale(entity, rect.width, rect.height);

    entity.scale = new Two.Vector(rect.width, rect.height);
    entity.object = group;
    entities.push(entity);

    x += rect.width + defaultStyles.margin.left + defaultStyles.margin.right;

    group.text = text;
    group.rectangle = rectangle;
    group.entity = entity;

    group.add(rectangle, text);
    two.add(group);
  }

  Matter.World.add(solver.world, entities);
}

function update(frameCount, timeDelta) {
  console.log(111);
  var allBodies = Matter.Composite.allBodies(solver.world);
  Matter.MouseConstraint.update(mouse, allBodies);
  Matter.MouseConstraint._triggerEvents(mouse);

  Matter.Engine.update(solver);

  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    entity.object.position.copy(entity.position);
    entity.object.rotation = entity.angle;
  }
}

function createBoundary(width, height) {
  var rectangle = two.makeRectangle(0, 0, width, height);
  rectangle.visible = false;

  rectangle.entity = Matter.Bodies.rectangle(
    0,
    0,
    width,
    height,
    bounds.properties
  );
  rectangle.entity.position = rectangle.position;

  return rectangle;
}

function dropGenTab(tab) {
  activeClick = false;
  console.log("activeClick:", activeClick);
  Matter.Body.setStatic(bounds.bottom.entity, false);
  console.log("bounds", bounds.bottom.entity.isStatic);

  let makeBottomBoundry = setTimeout(() => {
    Matter.Body.setStatic(bounds.bottom.entity, true);
    console.log("bounds", bounds.bottom.entity.isStatic);
  }, 1000);
  // clearTimeout(makeBottomBoundry);

  let addBlocks = setTimeout(() => {
    addSlogan(tab);
    resize();
  }, 2000);
  // clearTimeout(addBlocks);
}


