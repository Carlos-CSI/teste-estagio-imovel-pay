package com.rodrigues.cobrancas.business.dto;

import com.rodrigues.cobrancas.business.enums.StatusCobranca;
import jakarta.validation.constraints.NotNull;

public record StatusRequestDTO(

        @NotNull(message = "O status deve ser informado")
        StatusCobranca status
) {
}