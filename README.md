## What is it about?

A suite of performance benchmarks comparing useMemoReducer with alternative state management solutions in React.

## Commands to run benchmark

```
npm run build && npm start
```

## 📊 Benchmark Results

This section contains the benchmark results of three different state management approaches: `useMemoReducer`, `useReducer`, and `Redux`. The results were obtained using [Benchmark.js](https://benchmarkjs.com/).

> ⚠️ **Disclaimer Regarding Benchmark Results.**
> Please be aware that the benchmark results reported by this tool can vary depending on several factors including, but not limited to, hardware specifications, operating system, running background processes, browser or Node.js version, and device load.

### Test Case: Simple Counter

| Library            | Ops/sec           | Sample Size | Error       |
| ------------------ | ----------------- | ----------- | ----------- |
| **useMemoReducer** | **3,841 ops/sec** | **78 runs** | **±10.44%** |
| useReducer         | 2,694 ops/sec     | 63 runs     | ±29.91%     |
| Redux              | 97.85 ops/sec     | 24 runs     | ±24.43%     |

🏆 **Fastest Library:** `useMemoReducer`

### Test Case: List Rendering

| Library            | Ops/sec           | Sample Size | Error       |
| ------------------ | ----------------- | ----------- | ----------- |
| **useMemoReducer** | **4,555 ops/sec** | **74 runs** | **±12.70%** |
| useReducer         | 2,402 ops/sec     | 49 runs     | ±41.13%     |
| Redux              | 26.13 ops/sec     | 10 runs     | ±62.17%     |

🏆 **Fastest Library:** `useMemoReducer`

### Test Case: Complex State

| Library            | Ops/sec           | Sample Size | Error       |
| ------------------ | ----------------- | ----------- | ----------- |
| **useMemoReducer** | **4,347 ops/sec** | **77 runs** | **±12.51%** |
| useReducer         | 2,505 ops/sec     | 51 runs     | ±40.21%     |
| Redux              | 141 ops/sec       | 24 runs     | ±24.71%     |

🏆 **Fastest Library:** `useMemoReducer`

[Benchmark Repository](https://github.com/piskunovim/performance-analysis-useMemoReducer)
