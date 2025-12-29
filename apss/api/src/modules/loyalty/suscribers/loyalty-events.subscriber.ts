import { Inject, Injectable } from '@nestjs/common';
import { EVENT_BUS, type EventBusPort } from 'src/common/events/event-bus.port';

import { LOYALTY_REPO, type LoyaltyRepoPort } from 'src/model/ports/repositories/loyalty.repo.port';
import { LoyaltyReason } from 'src/model/domain/enums/loyalty';

@Injectable()
export class LoyaltyEventsSubscriber {
    constructor(
        @Inject(EVENT_BUS) private readonly bus: EventBusPort,
        @Inject(LOYALTY_REPO) private readonly loyaltyRepo: LoyaltyRepoPort,
    ) {
        //  si tu evento tiene otro nombre, cámbialo acá
        this.bus.subscribe('booking.completed', (e) => this.onBookingCompleted(e));
    }

    private async onBookingCompleted(event: any) {
        // esperamos que el event tenga bookingId
        const bookingId: string | undefined = event?.payload?.bookingId ?? event?.bookingId;
        if (!bookingId) return;

        const ctx = await this.loyaltyRepo.getBookingLoyaltyContext(bookingId);
        if (!ctx) return;

        // points = floor(price/10), mínimo 1
        const price = Number.parseFloat(ctx.price);
        const points = Math.max(1, Math.floor(price / 10));

        await this.loyaltyRepo.addEarnFromCompletedBooking({
            bookingId,
            reason: LoyaltyReason.BOOKING_COMPLETED_EARN,
            pointsDelta: points,
            note: `Earned from booking completion. price=${ctx.price}`,
        });
    }
}
