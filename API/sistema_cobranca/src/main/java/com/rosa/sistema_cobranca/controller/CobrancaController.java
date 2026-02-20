package com.rosa.sistema_cobranca.controller;

import com.rosa.sistema_cobranca.entity.Cobranca;
import com.rosa.sistema_cobranca.entity.Status;
import com.rosa.sistema_cobranca.repository.CobrancaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/cobranca")
// O Cross remove o bloqueio de segurança do navegador p/ permitir a comunicação
// entre Front e Backend.
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class CobrancaController {

    @Autowired
    //// Injeção automática de dependência para acesso ao banco de dados
    private CobrancaRepository repository;

    // Método para buscar todas as cobranças cadastradas no banco de dados
    @GetMapping
    public Page<Cobranca> listar(
            @RequestParam(required = false, defaultValue = "") String nome,
            @PageableDefault(size = 5, sort = "nomeCliente", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return repository.findByNomeClienteIgnoreCaseStartingWith(nome, pageable);
    }

    // Método para buscar os detalhes de uma única cobrança usando o ID
    @GetMapping("/{id}")
    public Cobranca buscarPorId(@PathVariable Long id) {
        // Busca no banco e, se não achar, lança uma exceção
        return repository.findById(id).orElseThrow();
    }

    // Método para cadastrar uma nova cobrança no sistema
    @PostMapping
    public Cobranca criar(@RequestBody Cobranca cobranca) {
        cobranca.setStatus(Status.PENDENTE);
        return repository.save(cobranca);
    }

    // Método para editar todos os dados de uma cobrança já existente
    @PutMapping("/{id}")
    public Cobranca atualizar(@PathVariable Long id, @RequestBody Cobranca dadosNovos) {
        // 1. Busca o cliente que já existe no banco pelo ID da URL
        Cobranca cobranca = repository.findById(id).orElseThrow();

        // 2. ATUALIZA os campos um por um
        cobranca.setNomeCliente(dadosNovos.getNomeCliente());
        cobranca.setEmail(dadosNovos.getEmail());
        cobranca.setCpf(dadosNovos.getCpf());
        cobranca.setTelefone(dadosNovos.getTelefone());
        cobranca.setValor(dadosNovos.getValor());
        cobranca.setDataVencimento(dadosNovos.getDataVencimento());
        //  cobranca.setDataPagamento(dadosNovos.getDataPagamento());
        //  cobranca.setStatus(dadosNovos.getStatus());

        if (dadosNovos.getStatus() != null) {
            cobranca.setStatus(dadosNovos.getStatus());
        }

        if (dadosNovos.getDataPagamento() != null) {
            cobranca.setDataPagamento(dadosNovos.getDataPagamento());
        }


        // 3. Salva o objeto atualizado
        return repository.save(cobranca);
    }

    // Este método serve para dar "baixa" em uma conta, mudando o status para PAGO.
    @PutMapping("/{id}/pagar/")
    public Cobranca pagar(@PathVariable Long id) {
        Cobranca cobranca = repository.findById(id).orElseThrow();

        cobranca.setStatus(Status.PAGO);
        cobranca.setDataPagamento(LocalDate.now()); // Adiciona a data de hoje ao pagar

        return repository.save(cobranca);

    }
}