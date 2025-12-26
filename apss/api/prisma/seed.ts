/* eslint-disable no-console */
import { PrismaClient, GlobalRole, BusinessRole, BusinessStatus } from "generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";


const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required for seed");

const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

const PLATFORM_CATEGORIES = [
    { name: "Barberías", slug: "barberias" },
    { name: "Salones de belleza", slug: "salones-de-belleza" },
    { name: "Spa", slug: "spa" },
    { name: "Uñas", slug: "unas" },
    { name: "Cejas y pestañas", slug: "cejas-y-pestanas" },
    { name: "Masajes", slug: "masajes" },
];

async function upsertAdmin() {
    const email = "admin@bokira.dev";
    const password = "Admin12345!";
    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
        where: { email },
        update: {
            name: "Bokira Admin",
            passwordHash,
            globalRole: GlobalRole.ADMIN,
            isActive: true,
        },
        create: {
            email,
            name: "Bokira Admin",
            passwordHash,
            globalRole: GlobalRole.ADMIN,
            isActive: true,
        },
    });

    return { admin, password };
}

async function seedPlatformCategories() {
    for (const c of PLATFORM_CATEGORIES) {
        await prisma.platformCategory.upsert({
            where: { slug: c.slug },
            update: { name: c.name },
            create: { name: c.name, slug: c.slug },
        });
    }
}

async function seedDemo(adminId: string) {
    // owner demo
    const ownerEmail = "owner@bokira.dev";
    const ownerPassword = "Owner12345!";
    const ownerHash = await bcrypt.hash(ownerPassword, 10);

    const owner = await prisma.user.upsert({
        where: { email: ownerEmail },
        update: { name: "Demo Owner", passwordHash: ownerHash, isActive: true },
        create: { email: ownerEmail, name: "Demo Owner", passwordHash: ownerHash, isActive: true },
    });

    // staff demo
    const staffEmail = "staff@bokira.dev";
    const staffPassword = "Staff12345!";
    const staffHash = await bcrypt.hash(staffPassword, 10);

    const staff = await prisma.user.upsert({
        where: { email: staffEmail },
        update: { name: "Demo Staff", passwordHash: staffHash, isActive: true },
        create: { email: staffEmail, name: "Demo Staff", passwordHash: staffHash, isActive: true },
    });

    const platform = await prisma.platformCategory.findUnique({ where: { slug: "barberias" } });
    if (!platform) throw new Error("Missing platformCategory barberias");

    const businessSlug = "nova-barber-demo";

    const business = await prisma.business.upsert({
        where: { slug: businessSlug },
        update: {
            ownerId: owner.id,
            platformCategoryId: platform.id,
            status: BusinessStatus.APPROVED,
            reviewedByAdminId: adminId,
            approvedAt: new Date(),
            isActive: true,
            timezone: "America/Lima",
            city: "Trujillo",
        },
        create: {
            ownerId: owner.id,
            platformCategoryId: platform.id,
            status: BusinessStatus.APPROVED,
            reviewedByAdminId: adminId,
            approvedAt: new Date(),
            name: "Nova Barber (Demo)",
            slug: businessSlug,
            description: "Negocio demo para pruebas de Bokira.",
            address: "Av. Demo 123",
            city: "Trujillo",
            phone: "900000000",
            timezone: "America/Lima",
            isActive: true,
        },
    });

    // membership (manager)
    await prisma.businessMember.upsert({
        where: { businessId_userId: { businessId: business.id, userId: staff.id } },
        update: { role: BusinessRole.MANAGER, isActive: true, deletedAt: null },
        create: { businessId: business.id, userId: staff.id, role: BusinessRole.MANAGER, isActive: true },
    });

    // business hours (Mon-Sat open, Sun closed)
    const hours = [
        { dayOfWeek: 0, openTime: "09:00", closeTime: "18:00", isClosed: true },
        { dayOfWeek: 1, openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: 2, openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: 3, openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: 4, openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: 5, openTime: "09:00", closeTime: "18:00", isClosed: false },
        { dayOfWeek: 6, openTime: "09:00", closeTime: "18:00", isClosed: false },
    ];

    for (const h of hours) {
        await prisma.businessHours.upsert({
            where: { businessId_dayOfWeek: { businessId: business.id, dayOfWeek: h.dayOfWeek } },
            update: { openTime: h.openTime, closeTime: h.closeTime, isClosed: h.isClosed },
            create: { businessId: business.id, ...h },
        });

        await prisma.staffWorkingHours.upsert({
            where: { businessId_staffId_dayOfWeek: { businessId: business.id, staffId: staff.id, dayOfWeek: h.dayOfWeek } },
            update: { startTime: h.openTime, endTime: h.closeTime, isOff: h.isClosed },
            create: {
                businessId: business.id,
                staffId: staff.id,
                dayOfWeek: h.dayOfWeek,
                startTime: h.openTime,
                endTime: h.closeTime,
                isOff: h.isClosed,
            },
        });
    }

    // service category
    const serviceCategory = await prisma.serviceCategory.upsert({
        where: { businessId_name: { businessId: business.id, name: "Cortes" } },
        update: { deletedAt: null },
        create: { businessId: business.id, name: "Cortes" },
    });

    // service (idempotente por findFirst)
    const existingService = await prisma.service.findFirst({
        where: { businessId: business.id, name: "Corte clásico" },
    });

    const service = existingService
        ? await prisma.service.update({
            where: { id: existingService.id },
            data: { deletedAt: null, isActive: true, serviceCategoryId: serviceCategory.id },
        })
        : await prisma.service.create({
            data: {
                businessId: business.id,
                serviceCategoryId: serviceCategory.id,
                name: "Corte clásico",
                description: "Corte de cabello clásico (demo).",
                price: "25.00",
                durationMin: 30,
                isActive: true,
            },
        });

    console.log("✅ Demo ready:", {
        businessSlug: business.slug,
        owner: { email: ownerEmail, password: ownerPassword },
        staff: { email: staffEmail, password: staffPassword },
        service: { id: service.id, name: service.name },
    });
}

async function main() {
    console.log("🌱 Seeding Bokira...");
    const { admin, password } = await upsertAdmin();
    await seedPlatformCategories();
    await seedDemo(admin.id);

    console.log("✅ Seed done.");
    console.log("🔐 Admin:", { email: admin.email, password });
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
