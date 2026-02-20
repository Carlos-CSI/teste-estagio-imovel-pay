package com.rosa.sistema_cobranca.service;

import com.rosa.sistema_cobranca.entity.Cobranca;
import com.rosa.sistema_cobranca.repository.CobrancaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CobrancaServiceImpl implements CobrancaService {

    @Autowired // O Spring "injeta" automaticamente as ferramentas para acessar o banco de dados.
    private CobrancaRepository repository;

    @Override // Implementa o método de listagem definido na interface.
    public List<Cobranca> listarTodos() {
        return repository.findAll();
    }

    @Override // Implementa o método de salvamento.
    public Cobranca salvar(Cobranca cobranca) {
        return repository.save(cobranca);
    }
}

