package com.example.fsdproject.repository;

import com.example.fsdproject.entity.Bid;
import com.example.fsdproject.entity.Sell;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellRepository extends JpaRepository<Sell, Long> {


}
