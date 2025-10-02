package br.inatel.nutriPlan.controllers;


import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

interface Service {
    String call();
}

public class MockService4Test {

    @Test
    void mockReturnsValue() {
        Service svc = mock(Service.class);
        when(svc.call()).thenReturn("ok");
        assertEquals("ok", svc.call());
        verify(svc, times(1)).call();
    }

    @Test
    void mockThrows() {
        Service svc = mock(Service.class);
        when(svc.call()).thenThrow(new RuntimeException("fail"));
        assertThrows(RuntimeException.class, svc::call);
    }

    @Test
    void mockDefault() {
        Service svc = mock(Service.class);
        assertNull(svc.call());
    }

    @Test
    void mockVerifyNoMore() {
        Service svc = mock(Service.class);
        svc.call();
        verify(svc, times(1)).call();
        verifyNoMoreInteractions(svc);
    }
}