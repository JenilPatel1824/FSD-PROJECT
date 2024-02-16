package com.example.fsdproject.service;

import com.example.fsdproject.entity.Sell;
import com.example.fsdproject.repository.SellRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SellService {

    @Autowired
    private SellRepository sellRepository;

    @Transactional
    public Sell saveSell(Sell sell)
    {
        return sellRepository.save(sell);

    }

    public Optional<Sell> findById(long sellid)
    {
        return sellRepository.findById(sellid);

    }

}
