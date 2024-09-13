package com.project4.JobBoardService.Enum;

public enum JobType {
    IN_OFFICE("In Office"),
    HYBRID("Hybrid"),
    REMOTE("Remote"),
    OVERSEA("Oversea");

    private final String value;

    JobType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }


    public static JobType fromString(String text) {
        for (JobType jt : JobType.values()) {
            if (jt.name().equalsIgnoreCase(text)) { // Match using `name()`
                return jt;
            }
        }
        throw new IllegalArgumentException("No constant with text " + text + " found");
    }
}
