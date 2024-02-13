package com.example.fsdproject.controller;

import com.example.fsdproject.entity.AuctionItem;
import com.example.fsdproject.entity.Bid;
import com.example.fsdproject.entity.User;
import com.example.fsdproject.service.AuctionItemService;
import com.example.fsdproject.service.BidService;
import com.example.fsdproject.service.UserService;
import org.hibernate.cache.spi.support.AbstractReadWriteAccess;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// AuctionItemController.java
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api")
public class AuctionItemController {
    private static final Logger logger = LoggerFactory.getLogger(AuctionItemController.class);

    @Autowired
    private AuctionItemService auctionItemService;

    @Autowired
    private UserService userService;

    @Autowired
    private BidService bidService;

    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping("/add-item")
    public ResponseEntity<?> addAuctionItems(@RequestBody AuctionItem auctionItem) {

        try {
            logger.info("Received signup request for username: {}", auctionItem.getUser().getUsername());


            String username = auctionItem.getUser().getUsername();
            User user = userService.findByUsername(username);

            // Set the user in the AuctionItem
            auctionItem.setUser(user);

            // Save the AuctionItem
            auctionItemService.saveAuctionItem(auctionItem);
            auctionItemService.saveAuctionItem(auctionItem);
            Map<String, String> response = new HashMap<>();
            response.put("data", "item  registered successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Handle other exceptions if needed
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error during addddddd iteeeemem");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/items")
    public ResponseEntity<?> getAuctionItems() {

        try {
            List<AuctionItem> auctionItems = auctionItemService.findAllItems();


            Map<String, Object> response = new HashMap<>();
            response.put("data", auctionItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Handle other exceptions if needed
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error during addddddd iteeeemem");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/my-items")
    public ResponseEntity<?> getMyAuctionItems(@RequestParam String username) {
        logger.info("Received myitem request for username: {}",username);



        try {
            User user=userService.findByUsername(username);
            long id=user.getId();


            List<AuctionItem> auctionItems = auctionItemService.findByUserId(id);

            Map<String, Object> response = new HashMap<>();
            response.put("data", auctionItems);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Handle other exceptions if needed
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error during addddddd iteeeemem");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/placebid")
    public ResponseEntity<?> placeBid(@RequestBody Bid bid) {
        // Validate bidRequest and handle the bidding logic
        try {

            double amount=bid.getAmount();
            long itemId=bid.getItem().getId();
            auctionItemService.updateCurrentBid(itemId,amount);

            bidService.placeBid(bid);
            return ResponseEntity.ok("Bid placed successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    static class BidRequest {
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

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{itemId}")
    public ResponseEntity<?> getUserByUsername(@PathVariable long itemId) {
        try {
            Optional<AuctionItem> item = auctionItemService.findAuctionItemById(itemId);

            if (item != null) {
                // Return the user object if found
                return ResponseEntity.ok(item);
            } else {
                // Return a response indicating that the user was not found
                Map<String, String> response = new HashMap<>();
                response.put("error", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            // Handle other exceptions if needed
            Map<String, String> response = new HashMap<>();
            response.put("error", "Error during user retrieval");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }




}





