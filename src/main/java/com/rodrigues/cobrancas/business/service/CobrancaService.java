package com.rodrigues.cobrancas.business.service;


import com.rodrigues.cobrancas.business.dto.CobrancaRequestDTO;
import com.rodrigues.cobrancas.business.dto.CobrancaResponseDTO;
import com.rodrigues.cobrancas.infrastructure.entity.Cobranca;
import com.rodrigues.cobrancas.business.enums.StatusCobranca;
import com.rodrigues.cobrancas.infrastructure.repository.CobrancaRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CobrancaService {

    private final CobrancaRepository repository;

    public List<CobrancaResponseDTO> listarTodas() {
        return repository.findAll().stream()
                .map(CobrancaResponseDTO::paraDTO)
                .toList();

    }

    public CobrancaResponseDTO criarCobranca(@Valid CobrancaRequestDTO dto) {
        Cobranca novaCobranca = Cobranca.builder()
                .nomeCliente(dto.nomeCliente())
                .valor(dto.valor())
                .dataVencimento(dto.dataVencimento())
                .status(StatusCobranca.PENDENTE) //Toda cobranca nasce com status Pendente
                .build();

        Cobranca salva = repository.save(novaCobranca);
        return CobrancaResponseDTO.paraDTO(salva);

    }

    public CobrancaResponseDTO atualizarStatus(Long id, StatusCobranca novoStatus) {
        Cobranca cobranca = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cobranca nao encontrada!"));
        cobranca.setStatus(novoStatus);
        Cobranca atualizada = repository.save(cobranca);
        return CobrancaResponseDTO.paraDTO(atualizada);
    }


}
