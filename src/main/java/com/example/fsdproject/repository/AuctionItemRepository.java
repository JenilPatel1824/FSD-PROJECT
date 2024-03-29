package com.example.fsdproject.repository;

import com.example.fsdproject.entity.AuctionItem;
import com.example.fsdproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// AuctionItemRepository.java
public interface AuctionItemRepository extends JpaRepository<AuctionItem, Long> {


    List<AuctionItem> findAll();

    List<AuctionItem> findByUser_Id(Long userId);
    List<AuctionItem> findAllByUserNot(User user);


}

