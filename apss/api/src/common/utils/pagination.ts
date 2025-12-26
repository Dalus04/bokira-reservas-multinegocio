export function normalizePagination(input: { page?: number; limit?: number }) {
    const page = Math.max(1, Number.isFinite(input.page) ? Number(input.page) : 1);
    const limitRaw = Number.isFinite(input.limit) ? Number(input.limit) : 20;
    const limit = Math.min(100, Math.max(1, limitRaw));
    const skip = (page - 1) * limit;
    const take = limit;

    return { page, limit, skip, take };
}
