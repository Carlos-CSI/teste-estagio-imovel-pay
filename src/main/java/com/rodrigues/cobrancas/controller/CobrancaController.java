package com.rodrigues.cobrancas.controller;


import com.rodrigues.cobrancas.business.dto.CobrancaRequestDTO;
import com.rodrigues.cobrancas.business.dto.CobrancaResponseDTO;
import com.rodrigues.cobrancas.business.dto.StatusRequestDTO;
import com.rodrigues.cobrancas.business.service.CobrancaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cobrancas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CobrancaController {

    private final CobrancaService service;

    @GetMapping
    public ResponseEntity<List<CobrancaResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @PostMapping
    public ResponseEntity<CobrancaResponseDTO> criarCobranca(@RequestBody @Valid CobrancaRequestDTO dto) {
        CobrancaResponseDTO criada = service.criarCobranca(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    // PATCH para atualização parcial (somente o status da cobranca)
    @PatchMapping("/{id}/status")
    public ResponseEntity<CobrancaResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody @Valid StatusRequestDTO dto) {
        CobrancaResponseDTO atualizada = service.atualizarStatus(id, dto.status());
        return ResponseEntity.ok(atualizada);
    }
}