package com.nutriplan.tests;

import org.junit.jupiter.api.Test;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;

public class ListUtilsTest3 {

    @Test
    void listAdd() {
        List<String> list = new ArrayList<>();
        list.add("a");
        assertEquals(1, list.size());
    }

    @Test
    void listRemove() {
        List<String> list = new ArrayList<>(List.of("a", "b"));
        list.remove("a");
        assertFalse(list.contains("a"));
    }

    @Test
    void listContains() {
        List<Integer> list = Arrays.asList(1,2,3);
        assertTrue(list.contains(2));
    }

    @Test
    void emptyList() {
        List<Object> list = new ArrayList<>();
        assertTrue(list.isEmpty());
    }
}