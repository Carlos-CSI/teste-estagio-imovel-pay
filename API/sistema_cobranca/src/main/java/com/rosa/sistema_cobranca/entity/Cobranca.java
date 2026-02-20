package com.rosa.sistema_cobranca.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity //Essa anotação transforma minha class em uma tabela no banco de dados.
@Data // Gera Getters, Setters e toString
@NoArgsConstructor // Exigido pelo Hibernate
@AllArgsConstructor // Facilita a criação de objetos
public class Cobranca {

    @Id //Define que este campo é a chave primária
    @GeneratedValue(strategy = GenerationType.IDENTITY)//O banco de dados gera os números sozinho (1,2,3...).
    private Long id;

    @NotBlank(message = "Nome do cliente é obrigatório") // Validação: torna este campo obrigatório.
    @Column(nullable = false)
    private String nomeCliente;

    @NotNull(message = "Valor é obrigatório") // Validação: torna este campo obrigatório.
    @Positive(message = "Valor deve ser maior que zero")
    @Column(nullable = false)
    private Double valor;

    @NotNull(message = "Data de vencimento é obrigatória")
    @Column(nullable = false)
    private LocalDate dataVencimento;

    @Column(name = "data_pagamento", nullable = true)
    private LocalDate dataPagamento;

    @NotNull(message = "Número de CPF é obrigatório")
    @Column(nullable = false)
    private String cpf;

    @NotNull(message = "O email é obrigatório")
    @Column(nullable = false)
    private String email;

    @NotNull(message = "O número de telefone é obrigatório")
    @Column(nullable = false)
    private String telefone;


    @Enumerated(EnumType.STRING)
    private Status status;
}


