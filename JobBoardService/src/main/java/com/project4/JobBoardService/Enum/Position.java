package com.project4.JobBoardService.Enum;

public enum Position {
    INTERN("Intern"),
    FRESHER("Fresher"),
    JUNIOR("Junior"),
    MIDDLE("Middle"),
    SENIOR("Senior"),
    LEADER("Leader"),
    MANAGER("Manager"),
    HR("Hr");

    private final String value;

    Position(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static Position fromString(String text) {
        for (Position p : Position.values()) {
            if (p.value.equalsIgnoreCase(text)) {
                return p;
            }
        }
        throw new IllegalArgumentException("No constant with text " + text + " found");
    }
}
