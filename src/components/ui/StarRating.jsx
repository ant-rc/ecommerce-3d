export default function StarRating({ value }) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = value >= i + 1;
    const half = !filled && value >= i + 0.5;
    return { filled, half, key: i };
  });

  return (
    <div className="flex gap-0.5">
      {stars.map(({ filled, half, key }) => (
        <svg
          key={key}
          viewBox="0 0 20 20"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={`half-${key}`}>
              <stop offset="50%" stopColor="#C6A962" />
              <stop offset="50%" stopColor="#D6D3CE" />
            </linearGradient>
          </defs>
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            fill={filled ? "#C6A962" : half ? `url(#half-${key})` : "#D6D3CE"}
          />
        </svg>
      ))}
    </div>
  );
}
