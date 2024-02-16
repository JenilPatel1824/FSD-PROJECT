package com.example.fsdproject.service;

import com.example.fsdproject.entity.Bid;
import com.example.fsdproject.entity.Sell;
import com.example.fsdproject.repository.BidRepository;
import com.example.fsdproject.repository.SellRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    public Optional<Bid> getHighestBidByItemId(Long itemId) {
        List<Bid> bids = bidRepository.findByItemIdOrderByAmountDesc(itemId);
        return bids.isEmpty() ? Optional.empty() : Optional.of(bids.get(0));
    }


    @Autowired
    private SellRepository sellRepository;

    public List<Sell> getSoldItemByUsername(String username) {
        return sellRepository.findBidsByUsername(username);
    }

}
