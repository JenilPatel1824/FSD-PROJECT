package com.example.fsdproject.repository;

import com.example.fsdproject.entity.Bid;
import com.example.fsdproject.entity.Sell;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SellRepository extends JpaRepository<Sell, Long> {
    @Query("SELECT s FROM Sell s WHERE s.bid.bidder.username = :username")
    List<Sell> findBidsByUsername(@Param("username") String username);

}
