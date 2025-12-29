export const routes = {
    auth: {
        login: "/login",
        register: "/register",
    },
    public: {
        businesses: "/businesses",
    },
    my: {
        root: "/my",
        notifications: "/my/notifications",
        loyalty: "/my/loyalty",
        businesses: "/my/businesses",
    },
    admin: {
        root: "/admin",
        businesses: "/admin/businesses",
        reviews: "/admin/reviews",
        auditLogs: "/admin/audit-logs",
        notificationJobs: "/admin/notifications/jobs",
    },
} as const;
