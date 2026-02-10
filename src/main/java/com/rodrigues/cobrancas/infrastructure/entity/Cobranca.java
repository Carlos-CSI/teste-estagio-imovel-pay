package com.rodrigues.cobrancas.infrastructure.entity;

import com.rodrigues.cobrancas.business.enums.StatusCobranca;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Table(name = "cobrancas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Cobranca {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeCliente;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(nullable = false)
    private LocalDate dataVencimento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusCobranca status;
}
