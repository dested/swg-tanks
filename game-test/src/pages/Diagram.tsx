import React, {useEffect, useRef} from 'react';
import {
  Clipper,
  ClipType,
  Path,
  Paths,
  Point,
  PolyFillType,
  PolyType,
} from '../utils/clipper';
import * as b2 from '@flyover/box2d';
import {b2ChainShape, b2CircleShape, b2ShapeType, b2Vec2} from '@flyover/box2d';
import grass from './grass_top.png';
const image = new Image();
image.src = grass;
image.onload = (e) => {
  (image as any).loaded = true;
};
let grassPattern: CanvasPattern;
const worldItems = [
  buildMap(
    '822.142 45.6898 833.053 51.7295 839.803 68.1994 840.613 83.3193 843.313 99.7892 845.473 115.179 846.553 131.109 849.793 146.769 868.073 151.429 870.393 163.619 872.493 179.819 876.693 195.419 884.563 211.369 911.863 235.939 921.943 245.179 922.573 260.929 923.143 275.949 918.803 294.239 916.013 308.189 913.843 319.659 923.143 347.249 935.983 391.689 774.643 402.009 783.173 365.849 784.013 348.209 777.293 333.719 758.093 300.699 758.303 291.669 767.612 262.909 766.662 244.709 774.892 221.559 786.802 197.029 788.622 179.969 787.082 170.289 776.082 148.289 776.742 141.029 785.322 124.969 791.922 115.069 797.572 94.0092 802.842 69.5294 807.432 58.4795 811.512 50.6595 816.612 46.9196',
  ),
  buildMap(
    '607.8 -116.7 612.6 -99.1 621.8 -79.9 628.6 -73.9 622.8 -71.5 628.2 -52.7 645.69 -34.55 633.69 -32.45 632.78 -22.64 637.73 -9.94995 645.29 1.75003 653.03 9.85001 659.75 16.15 642.53 13.45 645.23 20.35 656.42 31.59 664.28 38.97 642.02 38.13 658.68 54.3002 645.78 54.0002 624.63 46.0502 626.43 53.1002 609.48 47.8502 609.63 68.4002 618.78 66.7502 625.53 67.5002 629.421 82.1903 634.071 103.27 639.341 143.88 644.921 182.63 646.011 187.25 654.651 184.05 669.051 185.81 679.451 191.89 687.931 201.33 693.051 212.21 697.71 227.39 700.911 232.83 714.35 227.71 718.51 225.47 727.151 227.39 735.151 235.71 737.66 254.51 734.28 277.91 731.19 298.59 730.26 325.25 724.69 373.44 557.22 383.14 537.75 339.38 527.95 319.92 527.11 310.12 539.51 269.75 551.81 237.36 565.34 207.02 568.35 185.61 566.8 158.33 569.96 123.81 576.46 99.3704 583.22 84.8104 592.16 79.4303 595.94 55.2803 592.16 48.3503 571.58 58.2203 568.43 44.1504 550.37 50.0304 542.6 48.1404 567.17 20.4204 546.95 15.1603 564.71 0.440308 574.63 -18.1197 564.55 -19.3997 557.99 -21.7997 580.5 -48.1097 591.45 -71.2097 584.09 -73.9697 592.91 -87.6097 601.67 -103.81',
  ),
  buildMap(
    '-301.69 397.571 -288.08 342.841 -281.88 311.041 -283.08 281.841 -280.88 262.641 -267.88 243.841 -267.1 204.281 -265.06 189.831 -257.24 177.761 -258.38 150.101 -255.05 125.521 -247.35 101.651 -232.18 72.5306 -213.72 52.1906 -209.68 46.8207 -206.38 37.3607 -202.42 29.7707 -194.28 23.6107 -191.86 22.1807 -192.73 14.8607 -188.95 10.0008 -183.46 9.10077 -177.71 7.72073 -171.99 3.04074 -161.46 3.17075 -147.94 7.33075 -138.06 11.7507 -127.01 16.4307 -117.52 17.9907 -113.23 19.8107 -112.29 29.5107 -111.95 38.1806 -113.65 49.5706 -132.69 51.9506 -128.78 68.7806 -120.7 74.1006 -106.84 62.6206 -85.7502 45.0306 -57.4102 29.4306 -29.7203 20.8506 -1.66016 16.3206 19.2198 16.6806 46.4598 17.8806 44.7899 5.94055 44.4499 -40.1294 41.7299 -55.7694 29.2199 -77.3793 28.8798 -85.8893 33.3798 -92.2793 49.3597 -104.449 78.3798 -110.389 85.3798 -115.149 63.2598 -125.649 52.1998 -135.029 44.5597 -152.349 58.8397 -136.629 83.8998 -123.879 105.41 -121.719 113.24 -126.399 89.6598 -137.109 68.3297 -157.489 64.0597 -176.179 67.6597 -203.659 89.1396 -225.259 129.83 -246.049 150.63 -252.549 161.42 -252.029 166.97 -248.239 170.97 -247.239 181.57 -255.239 170.97 -268.039 172.97 -277.239 185.88 -287.009 191.38 -289.209 199.96 -304.609 215.14 -307.909 227.46 -306.589 240 -312.969 247.04 -313.849 251.88 -306.589 250.56 -296.469 251.22 -289.649 263.71 -276.249 276.97 -281.689 282.92 -284.409 290.9 -274.959 296.179 -245.319 303.72 -233.339 306.2 -224.379 300.82 -204.389 277.609 -191.149 277.609 -180.499 305.209 -191.599 312.029 -191.369 279.199 -171.349 226.059 -143.579 261.099 -133.739 273.699 -142.019 285.819 -146.459 307.759 -138.609 323.959 -126.109 340.759 -125.809 347.659 -120.709 352.699 -112.179 354.149 -98.2093 349.204 -86.5544 344.284 -75.0393 344.839 -61.3293 344.654 -51.1544 320.179 -10.2944 323.47 45.0057 340.985 46.5557 372.295 60.0407 388.88 68.4107 409.46 70.5656 424.15 69.7206 432.339 71.2806 436.76 76.8706 436.43 100.981 423.09 153.556 418.465 179.086 419.575 204.061 442.74 222.351 446.735 232.296 453.075 252.165 463.735 267.951 463.53 282.3 443.085 308.04 423.45 341.04 399.129 388.48 -1.29059 396.571 -13.7556 346.891 -37.2405 300.761 -52.8306 271.186 -56.9856 253.016 -52.4806 246.896 -28.2456 230.991 7.11438 195.926 36.4244 179.081 38.2094 175.171 13.3344 136.736 12.8744 113.391 13.7944 102.236 -3.40552 79.9806 -22.9555 66.2106 -46.1605 65.5306 -65.8553 72.4255 -80.4504 83.5555 -108.255 117.331 -113.685 127.326 -111.585 138.576 -120.285 150.576 -122.685 145.626 -130.69 156.096 -125.315 166.846 -118.671 180.641 -119.576 192.926 -125.741 209.961 -136.961 217.611 -140.751 224.466 -134.671 233.776 -132.866 244.416 -141.416 251.541 -136.61 272.271 -133.935 283.59 -115.575 293.85 -108.825 303.57 -98.2954 322.47 -87.7155 326.175 -77.9505 333.525 -76.9005 339.825 -79.5255 348.015 -84.5706 393.925',
  ),
  buildMap(
    '-827.949 415.35 -853.089 339.401 -863.849 303.791 -865.219 283.521 -859.779 265.461 -849.94 260.541 -842.06 247.021 -853.57 210.061 -856.2 170.791 -869.34 149.571 -877.94 125.811 -878.33 93.4807 -873.45 81.4008 -865.05 76.2008 -864.25 69.0008 -855.75 66.8008 -861.479 57.8307 -862.76 44.4608 -856.45 26.9008 -843.01 14.8208 -846.82 -1.14932 -868.349 -13.1493 -881.599 -3.05933 -881.74 -8.0293 -872.779 -14.3293 -881.459 -21.1193 -876.349 -24.4793 -870.19 -17.7593 -868.789 -27.6992 -866.2 -27.4893 -866.13 -17.8293 -846.67 -5.22931 -844.36 -13.3493 -836.23 -20.0593 -836.72 -31.8293 -839.44 -42.0693 -835.95 -50.0793 -843.47 -50.4793 -843.79 -53.9993 -832.99 -53.9193 -829.07 -66.8293 -827.979 -79.8293 -835.38 -92.5293 -817.68 -90.1292 -803.88 -86.2292 -792.48 -75.0293 -801.18 -66.5293 -804.58 -50.8293 -794.41 -43.5994 -797.02 -37.5694 -801.25 -35.2294 -800.829 -24.4994 -812.169 -12.9494 -805.169 -6.50943 -802.799 -4.52933 -778.2 -13.5893 -774.479 -21.9893 -772.02 -21.0893 -771.84 -13.4693 -767.7 -12.7493 -769.5 -10.1693 -775.08 -10.0493 -775.5 -3.38931 -779.039 -2.84933 -779.52 -8.06931 -801.239 0.210663 -801.649 7.88071 -811.989 18.3307 -802.529 25.3707 -794.889 36.3907 -790.409 48.2907 -788.379 55.0807 -781.799 56.1306 -776.969 48.1507 -774.729 33.1007 -768.359 18.8907 -752.94 4.40067 -738.6 -5.91931 -736.6 -9.69928 -746.57 -51.2593 -746.64 -63.9193 -743.16 -72.0793 -703.2 -99.3193 -699.21 -103.769 -698.71 -142.999 -695.88 -149.809 -688.59 -154.399 -669.12 -157.059 -648.84 -156.929 -636.1 -157.449 -626.43 -170.909 -617.79 -174.749 -604.83 -171.749 -580.92 -160.529 -567.14 -142.719 -565.71 -119.059 -565.45 -112.559 -557.63 -114.479 -550.07 -112.079 -542.27 -81.1194 -529.09 -68.2394 -523.96 -49.6695 -521.88 -30.5595 -511.22 -30.2995 -493.02 -27.6995 -475.36 -13.2495 -446.23 25.8505 -415.22 60.7804 -395.58 84.8904 -390.65 95.7704 -390.45 108.31 -390.87 119.93 -381.35 125.25 -375.33 132.67 -374.37 143.61 -391.85 199.34 -394.93 224.27 -385.48 222.17 -379.18 221.54 -370.36 225.95 -363.16 235.03 -360.22 247.63 -364.84 262.33 -368.62 283.96 -371.55 308.05 -375.19 340.55 -391.34 423.84',
  ),
];
const box2dWorld = new b2.b2World({x: 0, y: 10});

export function Diagram() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const world = useRef<Paths>(worldItems);

  function makeBodies() {
    let bodies = box2dWorld.GetBodyList();
    while (bodies) {
      if (bodies.GetUserData()?.land) {
        box2dWorld.DestroyBody(bodies);
      }
      bodies = bodies.m_next;
    }
    for (const path of world.current) {
      const bodyDef = new b2.b2BodyDef();
      bodyDef.position.Set(0, 0);
      const body = box2dWorld.CreateBody(bodyDef);
      const shape = new b2.b2ChainShape();
      shape.CreateChain(path);
      body.CreateFixture(shape);
      body.SetUserData({land: true});
      body.SetType(0);
    }
  }

  useEffect(() => {
    makeBodies();
  }, []);

  const onBomb = (x: number, y: number) => {
    let clipper = new Clipper();
    clipper.AddPaths(world.current, PolyType.ptSubject, true);
    let bomb = [pointToCircle(new Point(x, y), 50, 15)];
    clipper.AddPaths(bomb, PolyType.ptClip, true);
    let solution = new Array<Path>();
    clipper.Execute(ClipType.ctDifference, solution, PolyFillType.pftEvenOdd);

    console.log(`Subject has ${world.current.length} polys`);
    console.log(`Clip has ${bomb.length} polys`);
    console.log(`Solution has ${solution.length} polys`);
    world.current = solution;

    makeBodies();
  };
  const onDrop = (x: number, y: number) => {
    const bodyDef = new b2.b2BodyDef();
    bodyDef.position.Set(x, y);
    const body = box2dWorld.CreateBody(bodyDef);
    const mass = new b2.b2MassData();
    mass.mass = 500;
    body.SetMassData(mass);
    const fixtureDef = new b2.b2FixtureDef();
    fixtureDef.shape = new b2.b2CircleShape(20);
    fixtureDef.density = 0.1;
    fixtureDef.restitution = 0.9;
    body.CreateFixture(fixtureDef);
    body.SetUserData(undefined);
    body.SetType(2);
  };
  useEffect(() => {
    if (canvasRef.current) {
      function doDraw() {
        draw();
        requestAnimationFrame(doDraw);
      }
      requestAnimationFrame(doDraw);
    }
  }, [canvasRef.current]);

  function draw() {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d')!;
    if (!(image as any).loaded) {
      return;
    }
    const pattern =
      grassPattern || (grassPattern = context.createPattern(image, 'repeat')!);

    context.fillStyle = 'grey';
    context.fillRect(0, 0, 2000, 1000);
    box2dWorld.Step(0.16, 6, 2);

    let body = box2dWorld.GetBodyList();
    while (body) {
      context.save();
      context.beginPath();
      const fixture = body.GetFixtureList()!;
      const shape = fixture.GetShape()!;
      if (shape.GetType() === b2ShapeType.e_chainShape) {
        assertType<b2ChainShape>(shape);
        context.moveTo(shape.m_vertices[0].x, shape.m_vertices[0].y);
        for (const point of shape.m_vertices) {
          context.lineTo(point.x, point.y);
        }
        context.fillStyle = pattern;
        context.fill();
      } else if (shape.GetType() === b2ShapeType.e_circleShape) {
        assertType<b2CircleShape>(shape);

        DrawingUtils.pathCircle(
          context,
          body.GetPosition().x,
          body.GetPosition().y,
          shape.m_radius,
        );
        context.fillStyle = 'blue';
        context.fill();
      }

      context.restore();
      body = body.m_next;
    }
  }

  return (
    <div className="h-screen p-12 bg-yellow-100 font-sans tracking-wider">
      <canvas
        width={2000}
        height={1000}
        onContextMenu={(e) => {
          onDrop(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          e.preventDefault();
        }}
        onMouseDown={(e) => {
          e.button === 0 &&
            onBomb(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
          e.preventDefault();
          return false;
        }}
        ref={canvasRef}></canvas>
    </div>
  );
}
function pointToCircle(origin: Point, radius: number, sides: number) {
  let angle;
  const points: Point[] = [];

  for (var i = 0; i < sides; i++) {
    angle = (i * 360) / sides;
    points.push(
      new Point(
        origin.x + Math.sin(degToRad(angle)) * radius,
        origin.y + Math.cos(degToRad(angle)) * radius,
      ),
    );
  }

  return points;
}

function degToRad(deg: number) {
  return deg * 0.0174533;
}

function buildMap(map: string) {
  const points: Point[] = [];
  const m = map.split(' ');
  for (let i = 0; i < m.length; i += 2) {
    points.push(new Point(parseFloat(m[i]) + 1000, parseFloat(m[i + 1]) + 500));
  }
  return points;
}
export function assertType<T>(assertion: any): asserts assertion is T {}
export class DrawingUtils {
  static fillRect(
    context: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) {
    if (Math.max(x2 - x1, 0) === 0 || Math.max(y2 - y1, 0) === 0) {
      return;
    }
    context.fillRect(x1, y1, Math.max(x2 - x1, 0), Math.max(y2 - y1, 0));
  }

  static pathCircle(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
  ) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
  }
  static pathEllipse(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
  ) {
    context.beginPath();
    context.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
  }

  static drawGrid({
    context,
    scale,
    translateX,
    translateY,
    gridSize,
    width,
    height,
    lineWidth,
  }: {
    context: CanvasRenderingContext2D;
    scale: number;
    translateX: number;
    translateY: number;
    gridSize: number;
    width: number;
    height: number;
    lineWidth: number;
  }) {
    context.save();
    context.scale(scale, scale);

    context.translate(
      Math.round(translateX) - lineWidth / 2,
      Math.round(translateY) - lineWidth / 2,
    );

    context.strokeStyle = '#ccc';
    context.lineWidth = lineWidth;
    const squareSize = gridSize;
    for (let x = 0; x <= width; x += squareSize) {
      for (let y = 0; y <= height; y += squareSize) {
        context.strokeRect(x, 0, lineWidth, height);
        context.strokeRect(0, y, width, lineWidth);
      }
    }
    context.restore();
  }
}
