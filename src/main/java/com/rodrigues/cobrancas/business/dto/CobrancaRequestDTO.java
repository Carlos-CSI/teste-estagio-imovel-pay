package com.rodrigues.cobrancas.business.dto;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CobrancaRequestDTO(

        @NotBlank(message = "O nome do cliente é obrigatório")
        String nomeCliente,

        @NotNull(message = "O valor é obrigatório")
        @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero")
        BigDecimal valor,

        @NotNull(message = "A data de vencimento é obrigatória")
        LocalDate dataVencimento


) {
}
