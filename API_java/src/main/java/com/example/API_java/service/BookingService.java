package com.example.API_java.service;

import com.example.API_java.entity.Booking;
import com.example.API_java.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private VoucherService voucherService;

    @Transactional
    public void autoCompletePastBookings() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Fetch bookings with active statuses: PENDING, PAID, IN_PROGRESS
        List<Booking> activeBookings = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() != null && (b.getStatus().equalsIgnoreCase("PENDING") || b.getStatus().equalsIgnoreCase("PAID") || b.getStatus().equalsIgnoreCase("IN_PROGRESS")))
                .filter(b -> b.getBookingDate() != null)
                .toList();

        for (Booking booking : activeBookings) {
            boolean shouldComplete = false;
            if (booking.getBookingDate().isBefore(today)) {
                shouldComplete = true;
            } else if (booking.getBookingDate().isEqual(today)) {
                LocalTime endTime = booking.getEndTime();
                if (endTime == null && booking.getBookingTime() != null) {
                    int duration = booking.getDuration() != null ? booking.getDuration() : 30;
                    endTime = booking.getBookingTime().plusMinutes(duration);
                }
                if (endTime != null && endTime.isBefore(now)) {
                    shouldComplete = true;
                }
            }

            if (shouldComplete) {
                booking.setStatus("COMPLETED");
                bookingRepository.save(booking);

                // Trigger voucher campaigns on auto-completion
                if (booking.getUser() != null) {
                    try {
                        voucherService.evaluateCampaigns(booking.getUser().getId(), "FIRST_BOOKING_COMPLETED", null);
                        voucherService.evaluateCampaigns(booking.getUser().getId(), "BOOKING_COUNT_X", null);
                        voucherService.evaluateCampaigns(booking.getUser().getId(), "COMPLETED_HAIRCUTS_X", null);
                        voucherService.evaluateCampaigns(booking.getUser().getId(), "MEMBERSHIP_TIER", null);
                    } catch (Exception e) {
                        System.err.println("Error evaluating campaigns for auto-completed booking: " + e.getMessage());
                    }
                }
            }
        }
    }
}
