import React, { useEffect, useRef, useState } from 'react';
import {
  continueRender,
  delayRender,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Data = {
  oneLength: number;
  onePoints: DOMPoint[];
};

// The tracing is pretty bad - this just averages each point with the points before and after
// to smoothen it a bit
const smoothPoints = (points: DOMPoint[], smoothinFactor: number) => {
  return points.map((p, i) => {
    const all = new Array(smoothinFactor)
      .fill(1)
      .map((p, j) => points[i + j - smoothinFactor / 2]);
    const allX = all.filter(Boolean).map((a) => a.x);
    const allY = all.filter(Boolean).map((a) => a.y);
    return {
      ...p,
      x: allX.reduce((a, b) => a + b, 0) / allX.length,
      y: allY.reduce((a, b) => a + b, 0) / allY.length,
    };
  });
};

// Defining colors of the strokes



export const Bird: React.FC<{
  color1: string,
  color2: string,
  name: string
}> = ({ color1, color2, name }) => {

  const colors = [
    color1,
    color2,
  ].reverse();

  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // Do not render until points are fetched
  const [handle] = useState(() => delayRender());
  const [data, setData] = useState<Data | null>(null);
  const path1 = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Fetch the length and make an array of points. If length = 1000, we make 1000 points
    const path1Current = path1.current;
    if (!path1Current) {
      return;
    }
    const oneLength = Math.floor(path1Current.getTotalLength());
    const data = {
      oneLength,
      onePoints: smoothPoints(
        new Array(oneLength)
          .fill(true)
          .map((_, i) => path1Current.getPointAtLength(i) as DOMPoint)
          .reverse(),
        30
      ),
    };
    setData(data);

    continueRender(handle);
  }, [handle]);

  const toRender: {
    points: DOMPoint[];
    colors: string[];
    maxStrokeWidth: number;
    progress: number;
  }[] = data
      ? [
        {
          points: data.onePoints,
          colors,
          maxStrokeWidth: 24,
          // Apple's animation doesn't end so slowly, so we cap the spring at around
          // 95% of the progress to make it end more suddenly
          progress: interpolate(
            spring({
              frame: frame - 20,
              fps,
              config: {
                mass: 15,
                damping: 200,
              },
            }),
            [0, 0.95],
            [0, 1]
          ),
        },
      ]
      : [];

  return (
    <div
      style={{
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <span style={{ marginTop: '-600px', zIndex: '2', textAlign: 'left', fontFamily: 'Inter, sans-serif', fontSize: '2em', fontWeight: '600', color: color2 }}><span style={{color: color1}}>Hola holita,</span> {name}</span>
      <div style={{ width: 1280, height: 455, display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
        {/**
				 * Just traced with Sketch and directly copied in here
				 */}
        <svg
          width="382px"
          height="455px"
          viewBox="0 0 382 455"
        >
          <g fill="none">
            <path
              ref={path1}
              d="M205.2,506.8c19.9,28,83.4,41.3,141.7-22.1s60.5-140.2,60.5-140.2s14.9-18.2,17.6-38.6s19.5-50.5,57.6-69.6
                s82.5-26.2,82.5-26.2s-53.6,1.3-96.2,21.7s-51,28.8-51,28.8S346,238,313.2,307.2s23.5,129.5-20.8,155.2
                C248,488.1,179.3,382.6,123,335.1S20.6,262.9,31.2,250c10.6-12.9,117.9-33.3,225.2,71.4s119.7,187.1,16.8,213.3
                s-109.1,20.4-175.1,69.2c-66.1,48.8-12.9,48.3,31-16.4S250.2,380,323,354.6"
              id="Path"
              strokeWidth="12"
            />
          </g>
        </svg>
        {toRender.map((set) => {
          return (
            <div>
              {set.points.map((point, i) => {
                const pointInRange =
                  (set.points.length - i) / set.points.length;
                // Determine if point should be visible based on spring progress
                const visible = pointInRange < set.progress;
                // The tip of the animation is always slightly bigger, scale it up a bit
                const difference = Math.abs(pointInRange - set.progress);
                const scaleBonus =
                  interpolate(difference, [0, 0.01, 0.2], [0.3, 0.2, 0], {
                    extrapolateRight: 'clamp',
                  }) *
                  // As the animation stops, stop the tip scaling
                  interpolate(set.progress, [0.9, 1], [1, 0], {
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp',
                  });
                if (!visible) {
                  return null;
                }
                // At both ends, the stroke should be a bit thinner.
                const strokeWidth =
                  interpolate(
                    i / set.points.length,
                    [0, 0.1, 0.5, 0.8],
                    [18, set.maxStrokeWidth, set.maxStrokeWidth, 18]
                  ) *
                  (1 + scaleBonus);
                return (
                  <div
                    style={{
                      height: strokeWidth,
                      // For smoothing, apply a little bit of blur, but
                      // only while rendering, otherwise performance is even more horrible
                      filter:
                        process.env.NODE_ENV === 'production'
                          ? 'blur(1px)'
                          : undefined,
                      width: strokeWidth,
                      borderRadius: strokeWidth / 2,
                      // New interpolateColors() API!
                      backgroundColor: interpolateColors(
                        i,
                        // Makes an array like [0, 0.1, 0.2, ..., 1]
                        new Array(set.colors.length)
                          .fill(1)
                          .map(
                            (_, i) =>
                              (set.points.length * i) / (set.colors.length - 1)
                          ),
                        set.colors
                      ),
                      position: 'absolute',
                      left: point.x - strokeWidth / 2,
                      top: point.y - strokeWidth / 2,
                    }}
                  />
                );
              })}
            </div>
          );
        })}

      </div>
    </div>
  );
};