interface Props {
  labels: string[];
  data: number[];
  color?: string;
  height?: number;
  gridColor?: string;
  labelColor?: string;
}

export default function AreaChart({ labels, data, color = "#fabd00", height = 260, gridColor = "#2d313f", labelColor = "#8f8ba8" }: Props) {
  const W = 820, H = height, padX = 44, padTop = 16, padBottom = 28;
  const max = Math.max(...data, 1) * 1.15;
  const x = (i: number) => padX + (i / (data.length - 1)) * (W - padX * 2);
  const y = (v: number) => padTop + (1 - v / max) * (H - padTop - padBottom);
  const pts = data.map((v, i) => ({ x: x(i), y: y(v) }));

  let line = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
    line += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  const area = `${line} L ${pts[pts.length - 1].x},${H - padBottom} L ${pts[0].x},${H - padBottom} Z`;
  const grid = [0, 0.25, 0.5, 0.75, 1];
  const step = Math.ceil(labels.length / 8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((g, i) => {
        const gy = padTop + g * (H - padTop - padBottom);
        return (
          <g key={i}>
            <line x1={padX} y1={gy} x2={W - padX} y2={gy} stroke={gridColor} strokeDasharray="5 5" />
            <text x={8} y={gy + 4} fontSize="11" fill={labelColor}>{Math.round((max * (1 - g)) / 1000)}k</text>
          </g>
        );
      })}
      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
      {labels.map((l, i) => (i % step === 0 ? (
        <text key={i} x={x(i)} y={H - 8} fontSize="11" fill={labelColor} textAnchor="middle">{l}</text>
      ) : null))}
    </svg>
  );
}
