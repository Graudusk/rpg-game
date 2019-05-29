// (function() {
//     var app = {
//         started: false,
//         canvas: null,
//         plane: [],
//         directions: [
//             'north',
//             'west',
//             'east',
//             'south',
//             'northwest',
//             'northeast',
//             'southwest',
//             'southeast',
//         ],
//         rows: 0,
//         cols: 0,
//         marginTop: 0,
//         facingY: '',
//         moving: false,
//         facingX: '',
//         circleRadius: 0,
//         padding: 0,
//         width: 0,
//         height: 0,
//         barX: 0,
//         barY: 0,
//         posX: 0,
//         posY: 0,
//         distance: 0,
//         rounds: 0,
//         keyPressed: {},
//         total: 0,
//         interval: 0,
//         moveSpeed: 5,
//         stop: function() {
//             if (app.started) {
//                 clearInterval(app.timer);
//                 app.started = false;
//             }
//         },
//         start: function() {
//             if (!app.started) {
//                 app.interval = 60;//document.querySelector('input[name='interval']').value;
//                 app.timer = setInterval(function() {
//                     app.move();
//                     app.draw();
//                 }, app.interval);
//                 app.started = true;
//             }
//             for (var dir of app.directions) {
//                 app.preloadSprite(dir);
//             }
//         },
//         update: function() {
//             app.interval = document.querySelector("input[name='interval']").value;
//             app.stop();
//             app.start();
//         },
//         init: function() {
//             app.canvas = document.createElement('canvas');
//             app.rows = 15;
//             app.cols = 15;
//             app.marginTop = 0;
//             app.circleRadius = 16;
//             app.padding = 16;
//             // app.padding = app.circleRadius * 2;
//             app.width = app.cols * (app.circleRadius + app.circleRadius);
//             app.height = (app.rows * (app.circleRadius + app.circleRadius)) + app.marginTop;
//             app.barX = Math.floor(app.width / 2);
//             app.barY = Math.floor(app.height / 2);
//             app.posX = app.barX;
//             app.posY = app.barY;
//             app.canvas.id = 'CursorLayer';
//             app.canvas.width = app.width;
//             app.canvas.height = app.height;
//             app.canvas.style.zIndex = 8;
//             app.canvas.style.margin = 'auto';
//             app.canvas.style.display = 'block';
//             app.canvas.style.border = '1px solid #bbb';
//             app.interval = 30;//document.querySelector('input[name='interval']').value;
//             app.distance = 0;
//             app.rounds = 0;
//             app.total = 0;

//             // clearInterval(app.timer);
//             app.stop();

//             document.getElementById('plane').appendChild(app.canvas);

//             // for (var i = 0; i < app.rows; i++) {
//             //     app.plane.push([0]);
//             //     for (var o = 0; o < app.cols; o++) {
//             //         app.plane[i][o] = 0;
//             //     }
//             // }

//             app.start();
//         },
//         reset: function () {
//             app.posX = app.barX;
//             app.posY = app.barY;
//         },
//         preloadSprite: function(url) {
//             var img = new Image();

//             img.src = `assets/img/${url}.png`;
//         },
//         draw: function () {
//             // let board = app.plane.slice();
//             let ctx = app.canvas.getContext('2d');
//             let img = new Image();

//             ctx.font = '14px courier';
//             ctx.clearRect(0, 0, app.canvas.width, app.canvas.height);

//             img.src = `assets/img/${app.facing}.png`;

//             ctx.drawImage(img, app.posX, app.posY);

//             ctx.font = '20px courier';
//             ctx.fillStyle = '#bbb';
//             ctx.fillText(app.facing, 10, 20);
//             ctx.stroke();
//         },
//         checkPressed: function(key) {
//             return app.keyPressed[key] ? 1 : 0;
//         },
//         returnDirection: function() {
//             if (app.moving) {
//                 app.facingX = '';
//                 if (app.checkPressed('d')) {
//                     app.facingX = 'east';
//                 } else if (app.checkPressed('a')) {
//                     app.facingX = 'west';
//                 }

//                 app.facingY = '';
//                 if (app.checkPressed('w')) {
//                     app.facingY = 'north';
//                 } else if (app.checkPressed('s')) {
//                     app.facingY = 'south';
//                 }
//             }

//             return app.facingY + app.facingX;
//         },
//         move: function () {
//             var hMovement = app.checkPressed('d') - app.checkPressed('a');
//             var vMovement = app.checkPressed('s') - app.checkPressed('w');


//             if (hMovement != 0 && vMovement != 0) {
//                 var xySpeed = Math.sqrt((app.moveSpeed*app.moveSpeed)/2);

//                 app.moving = true;
//                 app.posX += xySpeed * hMovement;
//                 app.posY += xySpeed * vMovement;
//             } else if (hMovement != 0 || vMovement != 0) {
//                 app.moving = true;
//                 app.posX += hMovement * app.moveSpeed;
//                 app.posY += vMovement * app.moveSpeed;
//             }

//             if (vMovement == 0 && hMovement == 0) {
//                 app.moving = false;
//             }

//             app.facing = app.returnDirection();
//         }
//     };

//     window.addEventListener('keyup', function (e) { app.keyPressed[e.key] = false; });
//     window.addEventListener('keydown', function (e) { app.keyPressed[e.key] = true; });

//     app.init();
//     app.start();
// })();
