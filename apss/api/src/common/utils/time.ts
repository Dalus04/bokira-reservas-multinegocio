export function parseHHmm(time: string): { h: number; m: number } {
    const [hh, mm] = time.split(':').map(Number);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) throw new Error('INVALID_TIME');
    return { h: hh, m: mm };
}

// Construye Date asumiendo que el input (YYYY-MM-DD) está en UTC.
export function dateAtUtc(yyyyMmDd: string, hhmm: string): Date {
    const { h, m } = parseHHmm(hhmm);
    const [Y, M, D] = yyyyMmDd.split('-').map(Number);
    return new Date(Date.UTC(Y, M - 1, D, h, m, 0, 0));
}

export function addMinutes(d: Date, minutes: number): Date {
    return new Date(d.getTime() + minutes * 60_000);
}

export function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
    return aStart < bEnd && bStart < aEnd;
}
