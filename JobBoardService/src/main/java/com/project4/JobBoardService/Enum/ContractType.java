package com.project4.JobBoardService.Enum;

public enum ContractType {
    FREELANCE("Freelance"),
    FULLTIME("Fulltime"),
    PART_TIME("Part-time");

    private final String value;

ContractType(String value) {
    this.value = value;
}

public String getValue() {
    return value;
}

public static ContractType fromString(String text) {
    for (ContractType contractType : ContractType.values()) {
        if (contractType.value.equalsIgnoreCase(text)) {
            return contractType;
        }
    }
    throw new IllegalArgumentException("No constant with text " + text + " found");
}
}