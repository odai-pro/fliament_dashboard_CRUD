export function seededShuffle<T>(array: T[], seed: number): T[] {
    const shuffled = [...array];
    let m = shuffled.length;
    let t: T;
    let i: number;

    // Mulberry32 generator
    const random = (seed: number) => {
        let t = seed + 0x6D2B79F5;
        return () => {
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    };

    const rng = random(seed);

    // Fisher-Yates shuffle with seeded random
    while (m) {
        i = Math.floor(rng() * m--);
        t = shuffled[m];
        shuffled[m] = shuffled[i];
        shuffled[i] = t;
    }

    return shuffled;
}


