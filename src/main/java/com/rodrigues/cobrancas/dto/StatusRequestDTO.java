package com.rodrigues.cobrancas.dto;

import com.rodrigues.cobrancas.enums.StatusCobranca;
import jakarta.validation.constraints.NotNull;

public record StatusRequestDTO(

        @NotNull(message = "O status deve ser informado")
        StatusCobranca status
) {}