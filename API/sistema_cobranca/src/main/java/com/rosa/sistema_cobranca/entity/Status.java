package com.rosa.sistema_cobranca.entity;

/**
 * Enumeração que padroniza os estados de uma cobrança no sistema e
 * impede a entrada de dados inválidos na coluna 'status' do banco de dados.
 */

public enum Status {
    PENDENTE,
    PAGO
}


