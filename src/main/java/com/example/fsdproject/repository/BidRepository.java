package com.example.fsdproject.repository;

import com.example.fsdproject.entity.Bid;
import com.example.fsdproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByItemId(long id);
        List<Bid> findByItemIdOrderByAmountDesc(Long itemId);

}
