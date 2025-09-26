package com.nutriplan.tests;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class StringUtilsTest2 {

    @Test
    void concatStrings() {
        assertEquals("HelloWorld", "Hello" + "World");
    }

    @Test
    void stringLength() {
        assertEquals(5, "Hello".length());
    }

    @Test
    void substringTest() {
        assertEquals("ell", "Hello".substring(1, 4));
    }

    @Test
    void containsTest() {
        assertTrue("NutriPlan".contains("Plan"));
    }
}