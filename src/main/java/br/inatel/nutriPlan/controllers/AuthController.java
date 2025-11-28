package br.inatel.nutriPlan.controllers;

import br.inatel.nutriPlan.dtos.LoginDto;
import br.inatel.nutriPlan.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/auth")
public class AuthController {

  @Autowired private AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<Object> login(@Valid @RequestBody LoginDto loginDto) {
    return authService.login(loginDto);
  }

  @PostMapping("/register")
  public ResponseEntity<Object> register(@Valid @RequestBody LoginDto loginDto) {
    return authService.register(loginDto);
  }
}
