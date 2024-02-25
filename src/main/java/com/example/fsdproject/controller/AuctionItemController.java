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

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// AuctionItemController.java
@RestController
@CrossOrigin(origins = "${allowed.origins}")
@RequestMapping("/api/auctionitems")
public class AuctionItemController {
    private static final Logger logger = LoggerFactory.getLogger(AuctionItemController.class);

    @Autowired
    private AuctionItemService auctionItemService;

    @Autowired
    private UserService userService;

    @Autowired
    private BidService bidService;

    @CrossOrigin(origins = "${allowed.origins}")
    @PostMapping("/add-item")
    public ResponseEntity<?> addAuctionItems(@RequestBody AuctionItem auctionItem) {
        logger.info("Received Add Item request for username: {}", auctionItem.getUser().getUsername());
        System.out.println("Got req add itm");
        try {


            String username = auctionItem.getUser().getUsername();
            User user = userService.findByUsername(username);

            // Set the user in the AuctionItem
            auctionItem.setUser(user);



            double startingp=auctionItem.getStartingPrice();
            auctionItem.setCurrentBid(startingp);

            ZonedDateTime endTimeUtc = ZonedDateTime.ofInstant(
                    auctionItem.getEndTime().toInstant(),
                    ZoneId.systemDefault()
            ).withZoneSameInstant(ZoneId.of("UTC"));

            auctionItem.setEndTime(Date.from(endTimeUtc.toInstant()));

            System.out.println("Adjusted End Time: " + auctionItem.getEndTime());


            System.out.println("Original End Time: " + auctionItem.getEndTime());

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

    @CrossOrigin(origins = "${allowed.origins}")
    @GetMapping("/items")
    public ResponseEntity<?> getAuctionItems(@RequestParam String username) {

        try {
            System.out.println("no "+username);
            User user = userService.findByUsername(username);

            List<AuctionItem> auctionItems = auctionItemService.findItemsNotOwnedByUser(user);


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

    @CrossOrigin(origins = "${allowed.origins}")
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
            double cbid=bid.getItem().getCurrentBid();
            if(cbid < bid.getAmount()) {
                auctionItemService.updateCurrentBid(itemId, amount);

                bidService.placeBid(bid);
                return ResponseEntity.ok("Bid placed successfully.");
            }
            else {
                String errorMessage = "Please enter a bid amount greater than the current bid ";
                return ResponseEntity.badRequest().body(errorMessage);
            }
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

    @CrossOrigin(origins = "${allowed.origins}")
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





