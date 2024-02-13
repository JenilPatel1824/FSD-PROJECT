// Bid.java
package com.example.fsdproject.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
public class Bid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amount")
    private double amount;

    @CreationTimestamp
    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "bid_time")
    private Date bidTime;

    @ManyToOne
    @JoinColumn(name = "bidder_id", referencedColumnName = "id")
    private User bidder;

    @ManyToOne
    @JoinColumn(name = "item_id", referencedColumnName = "id")
    private AuctionItem item;

    // Constructors, getters, and setters

    public Bid() {
    }

    public Bid(double amount, User bidder, AuctionItem item) {
        this.amount = amount;
        this.bidder = bidder;
        this.item = item;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getBidTime() {
        return bidTime;
    }

    public void setBidTime(Date bidTime) {
        this.bidTime = bidTime;
    }

    public User getBidder() {
        return bidder;
    }

    public void setBidder(User bidder) {
        this.bidder = bidder;
    }

    public AuctionItem getItem() {
        return item;
    }

    public void setItem(AuctionItem item) {
        this.item = item;
    }
}
