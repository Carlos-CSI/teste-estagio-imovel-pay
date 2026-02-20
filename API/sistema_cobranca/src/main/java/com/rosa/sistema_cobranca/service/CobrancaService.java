package com.rosa.sistema_cobranca.service;

import com.rosa.sistema_cobranca.entity.Cobranca;

import java.util.List;

/**
 * Interface que define as operações permitidas para gerenciar cobranças.
 */
public interface CobrancaService {
    // Retorna uma lista com todas as cobranças cadastradas para exibir no React.
    List<Cobranca> listarTodos();

    // Recebe os dados de uma nova cobrança, valida e envia para serem salvos no banco de dados.
    Cobranca salvar(Cobranca cobranca);
}