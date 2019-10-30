"use strict";
(function () {
    Array.prototype.remove = function (val) {
        let index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    }

    let utils = {
        /*
        * 对象克隆（深拷贝）
        */
        clone: function (myObj) {
            if (typeof (myObj) !== 'object' || myObj === null) return myObj;
            let newObj = {};
            for (let i in myObj) {
                newObj[i] = utils.clone(myObj[i]);
            }
            return newObj;
        },

        /*
        * 对象合并（多级合并，浅拷贝）
        * @param obj1 被合并对象
        * @param obj2 要合并对象
        * @returns object 合并后的对象
        */
        assign: function (obj1, obj2) {
            Object.keys(obj1).forEach((key) => {
                if (typeof obj1[key] === 'object') {
                    obj2[key] = utils.assign(obj1[key], obj2[key]);
                }
            });
            return Object.assign(obj1, obj2);
        },

        ascSort: function (a, b, sortName) {
            return a[sortName] - b[sortName];
        },

        descSort: function (a, b, sortName) {
            return b[sortName] - a[sortName]
        },
    };

    const _Math = {
        DEG2RAD: Math.PI / 180,
        RAD2DEG: 180 / Math.PI,

        generateUUID: (function () {
            var lut = [];
            for (var i = 0; i < 256; i++) {
                lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
            }
            return function generateUUID() {
                var d0 = Math.random() * 0xffffffff | 0;
                var d1 = Math.random() * 0xffffffff | 0;
                var d2 = Math.random() * 0xffffffff | 0;
                var d3 = Math.random() * 0xffffffff | 0;
                var uuid = lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                    lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                    lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                    lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
                // .toUpperCase() here flattens concatenated strings to save heap memory space.
                return uuid.toUpperCase();
            };
        })(),

        //角度转弧度
        degToRad: function (degrees) {
            return degrees * _Math.DEG2RAD;
        },

        //弧度转角度
        radToDeg: function (radians) {
            return radians * _Math.RAD2DEG;
        },

        //获取两点的距离
        getDistance: function (p1, p2) {
            return Math.sqrt(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p2.y - p2.y), 2));
        }
    }

    //2维向量
    class Vector2 {
        constructor(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    //3维向量
    class Vector3 {
        constructor(x, y, z) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
        }
    }

    //欧拉角
    class Euler {
        constructor(x, y, z, order) {
            this.defaultOrder = 'XYZ';
            this.rotationOrder = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.order = order || this.defaultOrder;
        }
    }

    //四元素
    class Quaternion {
        constructor(x, y, z, w) {
            this.x = x || 0;
            this.y = y || 0;
            this.z = z || 0;
            this.w = w || 1;
        }

        //欧拉角转四元素
        setFromEuler(euler, update) {
            if (!euler) {
                throw new Error('setFromEuler() now expects an Euler rotation rather than a Vector3 and order.');
            }

            var x = euler.x, y = euler.y, z = euler.z, order = euler._order;

            var cos = Math.cos;
            var sin = Math.sin;

            var c1 = cos(x / 2);
            var c2 = cos(y / 2);
            var c3 = cos(z / 2);

            var s1 = sin(x / 2);
            var s2 = sin(y / 2);
            var s3 = sin(z / 2);

            if (order === 'XYZ') {
                this.x = s1 * c2 * c3 + c1 * s2 * s3;
                this.y = c1 * s2 * c3 - s1 * c2 * s3;
                this.z = c1 * c2 * s3 + s1 * s2 * c3;
                this.w = c1 * c2 * c3 - s1 * s2 * s3;
            } else if (order === 'YXZ') {
                this.x = s1 * c2 * c3 + c1 * s2 * s3;
                this.y = c1 * s2 * c3 - s1 * c2 * s3;
                this.z = c1 * c2 * s3 - s1 * s2 * c3;
                this.w = c1 * c2 * c3 + s1 * s2 * s3;
            } else if (order === 'ZXY') {
                this.x = s1 * c2 * c3 - c1 * s2 * s3;
                this.y = c1 * s2 * c3 + s1 * c2 * s3;
                this.z = c1 * c2 * s3 + s1 * s2 * c3;
                this.w = c1 * c2 * c3 - s1 * s2 * s3;
            } else if (order === 'ZYX') {
                this.x = s1 * c2 * c3 - c1 * s2 * s3;
                this.y = c1 * s2 * c3 + s1 * c2 * s3;
                this.z = c1 * c2 * s3 - s1 * s2 * c3;
                this.w = c1 * c2 * c3 + s1 * s2 * s3;
            } else if (order === 'YZX') {
                this.x = s1 * c2 * c3 + c1 * s2 * s3;
                this.y = c1 * s2 * c3 + s1 * c2 * s3;
                this.z = c1 * c2 * s3 - s1 * s2 * c3;
                this.w = c1 * c2 * c3 - s1 * s2 * s3;
            } else if (order === 'XZY') {
                this.x = s1 * c2 * c3 - c1 * s2 * s3;
                this.y = c1 * s2 * c3 - s1 * c2 * s3;
                this.z = c1 * c2 * s3 + s1 * s2 * c3;
                this.w = c1 * c2 * c3 + s1 * s2 * s3;
            }

            if (update) this.onChangeCallback();

            return this;
        }
    }

    //颜色
    class Color {
        constructor(r, g, b, a) {
            this.r = r || 0;
            this.g = g || 0;
            this.b = b || 0;
            this.a = a || 1;
        }
    }

    //颜色（HSL表现方式）
    class HSL {
        /*
        * Hue(色调)。0(或360)表示红色，120表示绿色，240表示蓝色，也可取其他数值来指定颜色。取值为：0 - 360
        * Saturation(饱和度)。取值为：0.0% - 100.0%
        * Lightness(亮度)。取值为：0.0% - 100.0%
        */
        constructor(h, s, l) {
            this.h = h || 0;
            this.s = s || '50%';
            this.l = l || '50%';
        }
    }

    let canvas = undefined;   //canvas画布
    let ctx = undefined;
    let sceneObj = [];
    let elementIndex = 0;     //创建序号
    let elementzIndex = 0;    //层级

    //射线
    class Raycaster {
        constructor() {
            this.interactionObject = [];
            this.coords = undefined;
            this.camera = undefined;
        }

        setFromCamera(coords, camera) {
            this.coords = coords;
            this.camera = camera;
        }

        intersectObject(object) {
            let self = this;
            self.interactionObject = [];
            self.interactionObject.push(object);
            return self.raycast(self.coords, self.camera);
        }

        intersectObjects(objects) {
            let self = this;
            self.interactionObject = [];
            if (Array.isArray(objects) === false) {
                console.error('CANVAS.Raycaster.intersectObjects: objects is not an Array.')
            }
            else {
                objects.forEach(function (value) {
                    self.interactionObject.push(value);
                });
            }

            return self.raycast(self.coords, self.camera);
        }

        raycast(coords) {
            var self = this;

            let point = {
                x: coords.x - canvas.getBoundingClientRect().left,
                y: coords.y - canvas.getBoundingClientRect().top
            }

            let objects = [];
            for (let obj of self.interactionObject) {
                if (obj.type === 'rect') {
                    if (point.x > obj.x && point.x < (obj.x + obj.width) && point.y > obj.y && point.y < (obj.y + obj.height)) {
                        objects.push(obj);
                    }
                }
                else if (obj.type === 'circle') {
                    if (obj.r > _Math.getDistance(obj, point)) {
                        objects.push(obj);
                    }
                }
            }
            objects.sort(function (a, b) {
                return utils.descSort(a, b, 'zIndex');
            });
            if (objects.length > 0) {
                return objects[0];
            }
        }
    }

    //刚体
    class RigidBody {
        constructor() {
            this.canDrag = false;       //是否能拖拽
            this.isRigidBody = false;   //是否是刚体
            this.useGravity = false;    //使用重力
            this.acc = 1;               //加速度
            this.bounce = 0.8;          //弹性系数

            this.speedVector = new Vector2();//速度向量
        }

        //自由落体运动
        fallMotion() {
            var self = this;
            if (!self.isRigidBody || !self.useGravity) {
                return;
            }
            var clientWidth = canvas.width,
                clientHeight = canvas.height;
            var offsetWidth = self.width,
                offsetHeight = self.height;
            if (self.type === 'circle') {
                offsetWidth = self.r;
                offsetHeight = self.r;
            }

            self.speedVector.y += self.acc * 2;
            var y = self.y + self.speedVector.y,
                x = self.x + self.speedVector.x;

            //当碰撞上下边界
            if (y >= clientHeight - offsetHeight) {
                self.speedVector.y *= -1 * self.bounce;
                self.speedVector.x *= self.bounce;
                y = clientHeight - offsetHeight;
            }
            else if (y <= 0) {
                self.speedVector.y *= -1;
                self.speedVector.x *= self.bounce;
                y = 0;
            }

            //当碰撞左右边界
            if (x >= clientWidth - offsetWidth) {
                self.speedVector.x *= -1 * self.bounce;
                x = clientWidth - offsetWidth;
            }
            else if (x <= 0) {
                self.speedVector.x *= -1 * self.bounce;
                x = 0;
            }

            for (let i in sceneObj) {
                if (sceneObj[i].isRigidBody && self.uuid != sceneObj[i].uuid) {

                }
            }

            if (Math.abs(self.speedVector.x) < 1) {
                self.speedVector.x = 0;
            }
            if (Math.abs(self.speedVector.y) < 1) {
                self.speedVector.y = 0;
            }

            self.x = x;
            self.y = y;
        }
    }

    //平面几何
    class PlaneGeometry extends RigidBody {
        constructor() {
            super();
            elementIndex++;
            elementzIndex++;

            this.uuid = _Math.generateUUID();
            this.index = elementIndex;
            this.zIndex = elementzIndex;
            this.type = undefined;  //几何类型
            this.pattern = 'fill';  //绘制方式(stroke：线条，fill：填充)
            this._color = undefined;
            this.needUpdate = true;
        }

        setColor(color) {
            if (color instanceof Color) {
                this._color = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
            }
            else if (color instanceof HSL) {
                this._color = 'hsl(' + color.h + ', ' + color.s + ',' + color.l + ')';
            }
            else {
                this._color = color;
            }
        }

        updateZIndex() {
            elementzIndex++;
            this.zIndex = elementzIndex;
            sceneObj.sort(function (a, b) {
                return utils.ascSort(a, b, 'zIndex');
            })
        }

        update() {
            var self = this;
            if (self.needUpdate) {
                self.fallMotion();
            }
            self.draw();
        }
    }

    //矩形
    class Rect extends PlaneGeometry {
        constructor(x, y, width, height, color) {
            super();
            this.type = 'rect';
            this.x = x || 0;
            this.y = y || 0;
            this.width = width || 50;
            this.height = width || 50;
            this.color = color || new Color(Math.ceil(Math.random() * 255), Math.ceil(Math.random() * 255), Math.ceil(Math.random() * 255), 1);
        }

        draw() {
            if (this.pattern === 'fill') {
                ctx.beginPath();
                this.setColor(this.color);
                ctx.fillStyle = this._color;
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.fill();
            }
            else if (this.pattern === 'stroke') {
                ctx.beginPath();
                this.setColor(this.color);
                ctx.strokeStyle = this._color;
                ctx.rect(this.x, this.y, this.width, this.height);
                ctx.stroke();
            }
        }
    }

    //圆形
    class Circle extends PlaneGeometry {
        constructor(x, y, r, color) {
            super();
            this.type = 'circle';
            this.x = x || 0;
            this.y = y || 0;
            this.r = r || 25;
            this.color = color || new Color(Math.ceil(Math.random() * 255), Math.ceil(Math.random() * 255), Math.ceil(Math.random() * 255), 1);
        }

        draw() {
            if (this.pattern === 'fill') {
                ctx.beginPath();
                this.setColor(this.color);
                ctx.fillStyle = this._color;
                ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
                ctx.fill();
            }
            else if (this.pattern === 'stroke') {
                ctx.beginPath();
                this.setColor(this.color);
                ctx.strokeStyle = this._color;
                ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }

    class Camera {
        constructor(fov, aspect, near, far) {
            this.position = new Vector3();
            this.rotation = new Quaternion();
            this.scale = new Vector3(1, 1, 1);
            this.fov = fov || 70;
            this.aspect = aspect || 1;
            this.near = near || 1;
            this.far = far || 1000;
        }
    }

    //场景
    class Scene {
        constructor() {
            this.children = [];
            sceneObj = this.children;
        }

        add(obj) {
            this.children.push(obj);
            obj.parent = this;
        }

        remove(obj) {
            this.children.remove(obj);
            obj.parent = null;
        }
    }

    //渲染器
    class Renderer {
        constructor() {
            canvas = document.createElement('canvas');
            ctx = canvas.getContext('2d');
            this.fillStyle = '#ffffff';
            this.canvas = canvas;
        }

        //设置背景色
        setClearColor(color) {
            this.fillStyle = color;
        }

        //设置尺寸
        setSize(width, height) {
            canvas.width = width;
            canvas.height = height;
        }

        //渲染场景
        render(scene, camera) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = this.fillStyle;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            scene.children.forEach(function (value) {
                value.update();
            });
        }
    }

    let CANVAS = {
        utils: utils,
        Math: _Math,
        Vector2: Vector2,
        Vector3: Vector3,
        Euler: Euler,
        Quaternion: Quaternion,
        Color: Color,
        HSL: HSL,
        Raycaster: Raycaster,
        Rect: Rect,
        Circle: Circle,
        Camera: Camera,
        Scene: Scene,
        Renderer: Renderer,
    };
    window.CANVAS = CANVAS;
})();