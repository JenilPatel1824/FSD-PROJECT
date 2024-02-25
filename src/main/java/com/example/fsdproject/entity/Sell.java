package com.example.fsdproject.entity;

import jakarta.persistence.*;
import jdk.jfr.Enabled;

import java.time.LocalDateTime;

@Entity
public class Sell {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bid_id", referencedColumnName = "id",unique = true)
    private Bid bid;

    @Column(name = "sold")
    private boolean sold;
    @Column(name = "payment")
    private boolean payment;

    @Column(name = "payment_timestamp")
    private LocalDateTime paymentTimestamp;

    public LocalDateTime getPaymentTimestamp() {
        return paymentTimestamp;
    }

    public void setPaymentTimestamp(LocalDateTime paymentTimestamp) {
        this.paymentTimestamp = paymentTimestamp;
    }

    public boolean getPayment() {
        return payment;
    }

    public void setPayment(boolean payment) {

        this.payment = payment;
        if (!payment) {
            this.paymentTimestamp = null; // Set paymentTimestamp to null if payment is false
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bid getBid() {
        return bid;
    }

    public void setBid(Bid bid) {
        this.bid = bid;
    }

    public boolean getSold() {
        return sold;
    }

    public void setSold(boolean sold) {
        this.sold = sold;
    }
}
