package com.example.API_java.service;

import com.example.API_java.dto.PayrollResponse;
import com.example.API_java.entity.*;
import com.example.API_java.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PayrollService {

    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private SalarySettingRepository salarySettingRepository;
    @Autowired
    private ExperienceSalaryRepository experienceSalaryRepository;
    @Autowired
    private AdvanceSalaryRepository advanceSalaryRepository;
    @Autowired
    private PenaltyRepository penaltyRepository;
    @Autowired
    private PayrollDeductionRepository payrollDeductionRepository;

    public List<PayrollResponse> generatePayroll(int year, int month) {
        List<Staff> staffs = staffRepository.findAll();
        List<PayrollResponse> payrolls = new ArrayList<>();
        
        SalarySetting setting = salarySettingRepository.findAll().stream().findFirst().orElse(new SalarySetting());
        Double commissionRate = setting.getCommissionRate() != null ? setting.getCommissionRate() : 15.0;

        for (Staff staff : staffs) {
            if (staff.getIsActive() == null || !staff.getIsActive()) continue; // Skip inactive? The prompt doesn't specify, but better to generate for all active. We'll generate for all in DB. Wait, let's just generate for all.
            
            PayrollResponse res = new PayrollResponse();
            res.setStaffId(staff.getId());
            res.setStaffName(staff.getName());
            res.setBranch(staff.getBranch());
            res.setExperienceYears(staff.getExperienceYears() != null ? staff.getExperienceYears() : 0);
            res.setMonth(month);
            res.setYear(year);

            // Base Salary
            Double baseSalary = experienceSalaryRepository
                .findByYearsOfExperience(res.getExperienceYears())
                .map(ExperienceSalary::getBaseSalary)
                .orElse(5000000.0); // Default if not found
            res.setBaseSalary(baseSalary);

            // Completed Bookings
            List<Booking> completedBookings = bookingRepository.findCompletedByStaffAndMonth(staff.getId(), year, month);
            Double totalRevenue = 0.0;
            Double commissionAmount = 0.0;
            List<PayrollResponse.CommissionDetail> commDetails = new ArrayList<>();

            for (Booking b : completedBookings) {
                if (b.getService() != null && b.getService().getPrice() != null) {
                    double revenue = b.getService().getPrice().doubleValue();
                    double comm = revenue * (commissionRate / 100.0);
                    
                    totalRevenue += revenue;
                    commissionAmount += comm;

                    PayrollResponse.CommissionDetail cd = new PayrollResponse.CommissionDetail();
                    cd.setDate(b.getBookingDate() != null ? b.getBookingDate().toString() : "");
                    cd.setCode("BK" + b.getId());
                    cd.setServiceNames(b.getService().getName());
                    cd.setValue(revenue);
                    cd.setCommission(comm);
                    commDetails.add(cd);
                }
            }
            res.setTotalCompletedRevenue(totalRevenue);
            res.setCommissionRate(commissionRate);
            res.setCommissionAmount(commissionAmount);
            res.setCommissions(commDetails);

            // Advance Salary
            List<AdvanceSalary> advances = advanceSalaryRepository.findByStaffAndMonth(staff.getId(), year, month);
            Double totalAdvance = 0.0;
            List<PayrollResponse.AdvanceDetail> advDetails = new ArrayList<>();
            for (AdvanceSalary a : advances) {
                totalAdvance += a.getAmount();
                PayrollResponse.AdvanceDetail ad = new PayrollResponse.AdvanceDetail();
                ad.setAdvanceDate(a.getAdvanceDate().toString());
                ad.setAmount(a.getAmount());
                ad.setNotes(a.getNotes());
                advDetails.add(ad);
            }
            res.setTotalAdvance(totalAdvance);
            res.setAdvances(advDetails);

            // Penalty
            List<Penalty> penalties = penaltyRepository.findByStaffAndMonth(staff.getId(), year, month);
            Double totalPenalty = 0.0;
            List<PayrollResponse.PenaltyDetail> penDetails = new ArrayList<>();
            for (Penalty p : penalties) {
                totalPenalty += p.getAmount();
                PayrollResponse.PenaltyDetail pd = new PayrollResponse.PenaltyDetail();
                pd.setPenaltyDate(p.getPenaltyDate().toString());
                pd.setPenaltyType(p.getPenaltyType());
                pd.setAmount(p.getAmount());
                pd.setNotes(p.getNotes());
                penDetails.add(pd);
            }
            res.setTotalPenalty(totalPenalty);
            res.setPenalties(penDetails);

            // Leave Deductions
            List<PayrollDeduction> leaveDeds = payrollDeductionRepository.findByStaffAndMonth(staff.getId(), year, month);
            Integer leaveDays = leaveDeds.size();
            Double leaveDeduction = leaveDeds.stream().mapToDouble(d -> d.getDeductionAmount().doubleValue()).sum();
            res.setLeaveDays(leaveDays);
            res.setLeaveDeduction(leaveDeduction);

            // Net Salary
            Double netSalary = baseSalary + commissionAmount - totalAdvance - totalPenalty - leaveDeduction;
            res.setNetSalary(netSalary);

            payrolls.add(res);
        }
        return payrolls;
    }
}
