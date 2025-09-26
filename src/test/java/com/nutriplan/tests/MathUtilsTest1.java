package com.nutriplan.tests;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class MathUtilsTest1 {

    @Test
    void addPositiveNumbers() {
        assertEquals(5, 2 + 3);
    }

    @Test
    void subtractNumbers() {
        assertEquals(1, 3 - 2);
    }

    @Test
    void multiplyNumbers() {
        assertEquals(6, 2 * 3);
    }

    @Test
    void divideNumbers() {
        assertEquals(2, 6 / 3);
    }
}