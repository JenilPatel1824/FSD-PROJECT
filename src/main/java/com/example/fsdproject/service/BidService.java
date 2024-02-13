package com.example.fsdproject.service;

import com.example.fsdproject.entity.Bid;
import com.example.fsdproject.repository.BidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BidService {
    @Autowired
    private BidRepository bidRepository;

    public Bid placeBid(Bid bid)
    {
        return bidRepository.save(bid);
    }

    public List<Bid> findByItemId(long itemId)
    {
        return bidRepository.findByItemId(itemId);
    }

}
