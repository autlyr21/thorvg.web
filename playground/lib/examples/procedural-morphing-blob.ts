import { ShowcaseExample } from './types';

export const proceduralMorphingBlobExample: ShowcaseExample = {
  id: 'procedural-morphing-blob',
  title: 'Procedural Morphing Blob',
  description: 'Animate a smooth organic path with layered sine waves',
  category: 'advanced',
  useDarkCanvas: true,
  code: `// Procedural morphing with a retained ThorVG path

import { init } from '@thorvg/webcanvas';

const TVG = await init({
  renderer: 'gl',
  locateFile: (path) => '/webcanvas/' + path.split('/').pop()
});

const canvas = new TVG.Canvas('#canvas', {
  width: 600,
  height: 600
});

// Build the static backdrop once.
const backdrop = new TVG.Shape();
backdrop.appendRect(0, 0, 600, 600);
backdrop.fill(8, 10, 25, 255);
canvas.add(backdrop);

const halo = new TVG.Shape();
halo.appendCircle(300, 300, 225, 225);
const haloFill = new TVG.RadialGradient(300, 300, 225);
haloFill.setStops(
  [0, [107, 78, 255, 52]],
  [0.55, [39, 184, 255, 18]],
  [1, [8, 10, 25, 0]]
);
halo.fill(haloFill);
canvas.add(halo);

// These retained shapes only replace their path data during animation.
const glow = new TVG.Shape();
glow.fill(73, 111, 255, 40);
canvas.add(glow);

const blob = new TVG.Shape();
const blobFill = new TVG.LinearGradient(155, 145, 455, 465);
blobFill.setStops(
  [0, [255, 91, 178, 255]],
  [0.42, [132, 77, 255, 255]],
  [1, [35, 211, 255, 255]]
);
blob.fill(blobFill);
blob.stroke({ width: 3, color: [255, 255, 255, 72] });
canvas.add(blob);

const shine = new TVG.Shape();
const shineFill = new TVG.RadialGradient(235, 215, 115);
shineFill.setStops(
  [0, [255, 255, 255, 76]],
  [0.55, [255, 255, 255, 20]],
  [1, [255, 255, 255, 0]]
);
shine.fill(shineFill);
canvas.add(shine);

const POINT_COUNT = 14;

function blobPoints(time, scale = 1) {
  const points = [];

  for (let i = 0; i < POINT_COUNT; i++) {
    const angle = (i / POINT_COUNT) * Math.PI * 2;
    const radius = scale * (
      154
      + 24 * Math.sin(angle * 3 + time * 1.15)
      + 17 * Math.sin(angle * 5 - time * 0.82)
      + 10 * Math.sin(angle * 2 + time * 0.47)
    );

    points.push([
      300 + Math.cos(angle) * radius,
      305 + Math.sin(angle) * radius
    ]);
  }

  return points;
}

// Convert a closed Catmull-Rom spline to cubic Bezier segments.
function appendSmoothPath(shape, points) {
  const count = points.length;
  shape.moveTo(points[0][0], points[0][1]);

  for (let i = 0; i < count; i++) {
    const previous = points[(i - 1 + count) % count];
    const current = points[i];
    const next = points[(i + 1) % count];
    const afterNext = points[(i + 2) % count];

    shape.cubicTo(
      current[0] + (next[0] - previous[0]) / 6,
      current[1] + (next[1] - previous[1]) / 6,
      next[0] - (afterNext[0] - current[0]) / 6,
      next[1] - (afterNext[1] - current[1]) / 6,
      next[0],
      next[1]
    );
  }

  shape.close();
}

const startTime = performance.now();

function animate(currentTime) {
  const time = (currentTime - startTime) / 1000;
  const points = blobPoints(time);

  glow.reset();
  appendSmoothPath(glow, blobPoints(time - 0.18, 1.09));

  blob.reset();
  appendSmoothPath(blob, points);

  // A small translucent copy creates a moving specular highlight.
  shine.reset();
  appendSmoothPath(shine, points.map(([x, y]) => [
    235 + (x - 300) * 0.5,
    215 + (y - 305) * 0.5
  ]));

  canvas.update();
  canvas.render();
  requestAnimationFrame(animate);
}

animate(performance.now());
`
};
