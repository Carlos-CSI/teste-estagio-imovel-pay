package com.rodrigues.cobrancas.dto;

import com.rodrigues.cobrancas.entity.Cobranca;
import com.rodrigues.cobrancas.enums.StatusCobranca;
import lombok.Builder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Builder
public record CobrancaResponseDTO(
        Long id,
        String nomeCliente,
        BigDecimal valor,
        LocalDate dataVencimento,
        StatusCobranca status
) {
    //Conversor Entidade p/ DTO p/ nao expor a entidade
    public static CobrancaResponseDTO paraDTO(Cobranca cobranca){
        return CobrancaResponseDTO.builder()
                .id(cobranca.getId())
                .nomeCliente(cobranca.getNomeCliente())
                .valor(cobranca.getValor())
                .dataVencimento(cobranca.getDataVencimento())
                .status(cobranca.getStatus())
                .build();
    }

}
