import { CodeTabs } from './ui/shadcn-io/code-tabs';
const CODES = {
  Problem1: `
// Implementation A: Mathematical Formula (Gauss's Formula)
var sum_to_n_a = function(n) {
	return (n * (n + 1)) / 2
}

// Implementation B: Iterative Loop
var sum_to_n_b = function(n) {
	let sum = 0
	for (let i = 1; i <= n; i++) {
		sum += i
	}
	return sum
}

// Implementation C: Recursive Approach
var sum_to_n_c = function(n) {
	if (n <= 1) return n
	return n + sum_to_n_c(n - 1)
}
    `,
  Bonus: `
// Implementation D: Using Array.from() with reduce
var sum_to_n_d = function(n) {
	return Array.from({ length: n }, (_, i) => i + 1).reduce((acc, curr) => acc + curr, 0)
}

// Implementation E: Using spread operator with keys()
var sum_to_n_e = function(n) {
	return [...Array(n + 1).keys()].reduce((acc, curr) => acc + curr, 0)
}

// Implementation F: Using while loop (backward iteration)
var sum_to_n_f = function(n) {
	let sum = 0
	let current = n
	while (current > 0) {
		sum += current
		current--
	}
	return sum
}

// Implementation G: Using Array.fill() and map()
var sum_to_n_g = function(n) {
	return Array(n).fill(0).map((_, i) => i + 1).reduce((a, b) => a + b, 0)
}

// Implementation H: Using generator function
var sum_to_n_h = function(n) {
	function* range(start, end) {
		for (let i = start; i <= end; i++) {
			yield i
		}
	}
	return [...range(1, n)].reduce((acc, val) => acc + val, 0)
}

// Implementation I: Using bitwise operations with loop
var sum_to_n_i = function(n) {
	let sum = 0
	for (let i = 1; i <= n; i++) {
		sum = sum + i
	}
	return sum >> 0
}

    `,
};
export default function Problem1() {
  return (
    <section id="problem1" className="max-w-screen-lg mx-auto py-10">
      <CodeTabs lang="tsx" codes={CODES} />
    </section>
  );
}
