package com.example.fsdproject.controller;

import com.example.fsdproject.entity.AuctionItem;
import com.example.fsdproject.entity.Bid;
import com.example.fsdproject.entity.Sell;
import com.example.fsdproject.repository.SellRepository;
import com.example.fsdproject.service.AuctionItemService;
import com.example.fsdproject.service.SellService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/sell")
public class SellController {

    @Autowired
    private SellService sellService;

    @Autowired
    private AuctionItemService auctionItemService;

    @Autowired
    private JavaMailSender javaMailSender;


    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/sellitem")
    public ResponseEntity<?> sellItem(@RequestBody Sell sell) {
        try {
            System.out.println("Got Request at sold "+sell.getBid().getAmount());
            System.out.println("Got Request at sold "+sell.getSold());
            AuctionItem item=sell.getBid().getItem();
            item.setStatus(true);






            auctionItemService.saveAuctionItem((item));
            sellService.saveSell(sell);

            String winningBidderEmail=sell.getBid().getBidder().getEmail();
            String itemName=sell.getBid().getItem().getItemName();
            double winningBidAmount=sell.getBid().getAmount();
            String ownerEmail=sell.getBid().getItem().getUser().getEmail();
            long sellNo=sell.getId();

            System.out.println("Email of reciver is: "+winningBidderEmail);

            sendEmail(winningBidderEmail, "Congratulations! You've Successfully Won the Auction",
                    "Dear Bidder,\n\nCongratulations! Your bid on the auction item \"" + itemName + "\" has been successful. You placed the highest bid, and the item is now yours.\n\n" +
                            "Item Name: " + itemName + "\n" +
                            "Winning Bid Amount: $" + winningBidAmount + "\n" +
                            "Owner's Email: " + ownerEmail + "\n" +
                            "Reference Number (Sell No): " + sellNo + "\n\n" +
                            "Feel free to reach out to the owner at the provided email for further communication. This reference number may be useful for future transactions.\n\n" +
                            "Thank you for participating in our auction, and we hope you enjoy your newly acquired item!\n\nBest regards,\nJenil Patel");



            return ResponseEntity.ok("Bid placed successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    private void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        javaMailSender.send(message);
    }

    static class sellRequest {
        private double amount;
        private String bidder;

        private long itemId;

        public long getItemId() {
            return itemId;
        }

        public void setItemId(long itemId) {
            this.itemId = itemId;
        }

        public double getAmount() {
            return amount;
        }

        public void setAmount(double amount) {
            this.amount = amount;
        }

        public String getBidder() {
            return bidder;
        }

        public void setBidder(String bidder) {
            this.bidder = bidder;
        }
    }

}
