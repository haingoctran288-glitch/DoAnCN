package com.example.API_java.dto;

import lombok.Data;
import java.util.List;

@Data
public class PayrollResponse {

    private Integer staffId;
    private String staffName;
    private String branch;
    private Integer experienceYears;
    private int month;
    private int year;

    private Double baseSalary;
    private Double totalCompletedRevenue;
    private Double commissionRate;
    private Double commissionAmount;
    private Double totalAdvance;
    private Double totalPenalty;
    private Integer leaveDays;
    private Double leaveDeduction;
    private Double netSalary;

    private List<AdvanceDetail> advances;
    private List<PenaltyDetail> penalties;
    private List<CommissionDetail> commissions;

    @Data
    public static class AdvanceDetail {
        private String advanceDate;
        private Double amount;
        private String notes;
    }

    @Data
    public static class PenaltyDetail {
        private String penaltyDate;
        private String penaltyType;
        private Double amount;
        private String notes;
    }

    @Data
    public static class CommissionDetail {
        private String date;
        private String code;
        private String serviceNames;
        private Double value;
        private Double commission;
    }
}
