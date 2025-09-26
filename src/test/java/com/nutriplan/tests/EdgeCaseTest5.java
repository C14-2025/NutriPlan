package com.nutriplan.tests;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class EdgeCaseTest5 {

    @Test
    void nullCheck() {
        Object o = null;
        assertNull(o);
    }

    @Test
    void notNullCheck() {
        Object o = new Object();
        assertNotNull(o);
    }

    @Test
    void booleanTrue() {
        assertTrue(3 > 2);
    }

    @Test
    void booleanFalse() {
        assertFalse(2 > 3);
    }
}